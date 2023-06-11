# Remove Drafts in Docusaurus in Azure Pipeline

## Purpose

Write, save, and commit blog/docs drafts while allowing for selective deployment.

## Indicating draft folders and files

Indicate that an article is a draft by prepending `DRAFT_` to the name of the folder or file. A script task in the deployment YAML will remove draft files before deploying the app.

- `2023-05-21-create-and-deploy-docusaurus` becomes `DRAFT_2023-05-21-create-and-deploy-docusaurus`
- `create-and-deploy-docusaurus.md` becomes `DRAFT_create-and-deploy-docusaurus.md`

Docusaurus documents and blog posts can either be stored in the root document paths (`blog`/`docs`) or in a subfolder within those paths. To account for this, we will want to remove files starting with `DRAFT` as well as recursively delete directories starting with `DRAFT`.

**Note**: Recursive deletion is dangerous. If you execute it on files not under source control, they may be deleted forever. We will be only running delete commands (`rm`, `rm -r`, `rmdir`) within local copies of the source code temporarily downloaded into the pipeline virtual machine. If something is accidentally deleted, the source control will be unaffected.

## Removing draft folders and files

This blog is built and deployed using an Azure DevOps Pipeline written in YAML. Some configure Azure to deploy to Static Web App upon pushing a build to a remote repo. Here's what my pipeline looked like before implementing the drafting abilities:

**build-and-deploy.yaml**

```yml
trigger: none

pool:
  vmImage: ubuntu-latest

variables:
  sourceDirectory: $(System.DefaultWorkingDirectory)
  docusaurDirectory: docusaur

steps:
  - task: AzureStaticWebApp@0
    inputs:
      app_location: $(docusaurDirectory)
      app_build_command: npm run build
      output_location: build
    env:
      azure_static_web_apps_api_token: $(swa_deployment_token)
```

The `AzureStaticWebApp@0` task runs relative to the virtual machine's default working directory. `System.DefaultWorkingDirectory` is a variable predefined by Azure for _the path where source code is automatically downloaded_. You can read more about predefined variables at [Azure DevOps System Variables](https://learn.microsoft.com/en-us/azure/devops/pipelines/build/variables?view=azure-devops&tabs=yaml#system-variables-devops-services).

`System.DefaultWorkingDirectory` is the path of the source code copy. We can remove folders and files within the virtual machine's default working directory to prevent from being published to the Static Web App. Removing these files, of course, has no effect on our source code, so we can run a recursive delete command (`rm -r`) without much fear.

To remove folders and files starting with `DRAFT`, we can add the following script to the pipeline:

**build-and-deploy.yaml (excerpt)**

```yml
- script: |
    find $(sourceDirectory)/$(docusaurDirectory) -type f -name 'DRAFT*' -exec rm {} +
    find $(sourceDirectory)/$(docusaurDirectory) -type d -name 'DRAFT*' -exec rmdir {} +
  displayName: 'Remove draft files and directories.'
```

You'll notice there are two very similar scripts. Let's break them down.

- `find $(System.DefaultWorkingDirectory)/$(docusaurDirectory)`: "find" is a bash command for recursively searching for files. The path "$(System.DefaultWorkingDirectory)" is the root of the copies repo, while "/$(docusaurDirectory)" is the root of my Docusaurus project. This path may vary based on how your project is set up.

- `-type f` and `-type d`: Search for files (f) and directories (d).

- `-name 'DRAFT*'`: Find files that start with `DRAFT`. You could also use `DRAFT_*` if you want the underscore to be significant.

- `-exec rm {} +`: As files or directories are found, execute the `rm` command (the current file is represented by the placeholder `{}`). `+` signifies the end of the `-exec` command.

- `exec rm -r {} +`: Like above, but `rm -r` will recursively remove folders

**Likewise for finding and removing directories, we can use the following bash command**:

```bash
find $(System.DefaultWorkingDirectory)/docusaur -type d -name 'DRAFT*' -exec rm -r {} +
```

- `-type d`: Search for directories rather than files.

- `-exec rmdir`: Remove found directory.

## Keywords

- YAML
- Azure Static Web App
- Docusaur

## Complete Pipeline

```yml
trigger: none

pool:
  vmImage: ubuntu-latest

variables:
  sourceDirectory: $(System.DefaultWorkingDirectory)
  docusaurDirectory: docusaur

steps:
  - script: |
      find $(sourceDirectory)/$(docusaurDirectory) -type f -name 'DRAFT*' -exec rm {} +
      find $(sourceDirectory)/$(docusaurDirectory) -type d -name 'DRAFT*' -exec rmdir {} +
    displayName: 'Remove draft files and directories.'

  - task: AzureStaticWebApp@0
    inputs:
      app_location: $(docusaurDirectory)
      app_build_command: npm run build
      output_location: build
    env:
      azure_static_web_apps_api_token: $(swa_deployment_token)
```

```bash
find docusaur/blog -type f -name 'DRAFT*' -exec rm {} +
```

```bash
find docusaur/blog -type d -name 'DRAFT*' -exec rmdir {} +
```

While working with my Docusaurus-powered blog, I came across a problem: I wanted to be able to write and save draft posts without deploying them onto my public site. When writing posts, I often times have several posts in the works. The problem is that when I run my pipeline, all the posts saved to the remote repo are published.

1. I wanted to be able to preview the blog, so my files still need to be in the right spot.
2. I needed an automatic was to recognize and remove draft files
3. A JSON-mapping was ruled out. This would require matching dir and file names, which sounds hard to maintain.
