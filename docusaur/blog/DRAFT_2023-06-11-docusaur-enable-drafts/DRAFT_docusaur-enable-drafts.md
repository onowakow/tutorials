# Enabling Drafts in Docusaurus

Docusaurus does not have prebuilt options for creating drafts. By _drafts_, I mean documents that should be viewable during development but not in production. I wanted my drafts to be fully deleted and not just hidden from the production build.

I came up with this simple method to selectively deploy drafts **to selectively release drafts while being able to write, save, and preview drafts that are not yet ready**.

:::tip

This blog post explains enabling drafts in a YAML deployed project. If you aren't deploying using YAML, you may still be able to adapt the general idea to your own setup.

:::

The solution I came up with is to prepend draft folders and files with `DRAFT`, and remove these files within the deployment pipeline. I hope the following post is helpful!

## Indicating draft folders and files

Since my pipeline systematically deletes folders and files marked as drafts, I needed a quick way to distinguish draft documents. I toyed with the idea of creating JSON documents to store draft status but ultimately decided that special folder/file names would be easy and sufficient for my purposes.

Start by prepending draft folders and files with `DRAFT` like so:

- `2023-05-21-create-and-deploy-docusaurus` becomes `DRAFT_2023-05-21-create-and-deploy-docusaurus`
- `create-and-deploy-docusaurus.md` becomes `DRAFT_create-and-deploy-docusaurus.md`

Docusaurus documents and blog posts can either be stored as single markdown files, or as folders with multiple markdown files, a media folder, etc. We will delete all files as well as recursively delete directories marked as `DRAFT`. If only part of a directory is not ready for release, simply don't mark the parent folder as a draft.

:::danger

This project will use forced-recursive deletion (`rm -rf`). **Forced-recursive deletion can cause permanent file loss if executed in the wrong place.**

We will only run this deletion within copies of the source code temporarily downloaded into the pipeline virtual machine. If something is accidentally deleted, the source control will be unaffected.

:::

## Removing draft folders and files

This blog is built and deployed using an Azure DevOps Pipeline written in YAML. Some configure Azure to deploy to Static Web App upon pushing a build to a remote repo. Here's what my pipeline looked like before implementing the drafting abilities:

**build-and-deploy.yaml (before draft support)**

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

`System.DefaultWorkingDirectory` is the path of the source code copy. Deleting folders and files within this directory will prevent them from being published in later steps.

To remove folders and files starting with `DRAFT`, we can add the following script to the pipeline. Please read on to understand the parts before implementing the script as **`rm -rf` is dangerous and may result in file loss**:

**build-and-deploy.yaml (excerpt)**

```yml
- script: |
    find $(sourceDirectory)/$(docusaurDirectory) -type f,d -name 'DRAFT*' -exec rm -rf {} +
  displayName: 'Remove draft files and directories.'
```

**Let's break down the script.**

- `find $(System.DefaultWorkingDirectory)/$(docusaurDirectory)`: `find` is a bash command for recursively searching for files. The path `$(System.DefaultWorkingDirectory)` is the root of the locally-downloaded source code, while `/$(docusaurDirectory)` is the root of my Docusaurus project. This path may vary based on how your project is set up.

- `-type f,d`: Search for files (f) and directories (d).

- `-name 'DRAFT*'`: Find files and directories that start with `DRAFT`. You could also use `DRAFT_*` if you want the underscore to be significant.

- `exec <command> {} +`: As files or directories are found, execute `<command>` on the current file, represented by the placeholder `{}`. `+` signifies the end of the `-exec` command.

- `rm -rf`: Remove files and directories recursively (forced). This deletes everything within a file tree. While `rm -r` does the same thing, it asks the user at each file and directory whether they want to proceed. `rm -rf` is forced, so it will indiscriminately delete everything in that file tree. This portion of the script **should be considered dangerous!** We are running it on a copy of source-controlled code, so deleting the wrong files can easily be undone. If you run `rm -rf` in the wrong place, however, you could cause permanent file loss.

## Full pipeline

Here's the full pipeline. Be sure to make changes to fit this solution to your project structure.

```yml
trigger: none

pool:
  vmImage: ubuntu-latest

variables:
  sourceDirectory: $(System.DefaultWorkingDirectory)
  docusaurDirectory: docusaur

steps:
  - script: |
      find $(sourceDirectory)/$(docusaurDirectory) -type f,d -name 'DRAFT*' -exec rm -rf {} +
    displayName: 'Remove draft files and directories.'

  - task: AzureStaticWebApp@0
    inputs:
      app_location: $(docusaurDirectory)
      app_build_command: npm run build
      output_location: build
    env:
      azure_static_web_apps_api_token: $(swa_deployment_token)
```

## Limitations

This method is quick and easy, but it has a few limitations.

1. Docusaurus internal linking depends on the file names. If a document contains a 'Go to Final Section' link, the link will break after the draft prefix is removed.

2. Git source control has no concept of moving or renaming files. Removing the 'DRAFT' prefix will appear to Git as a deletion of the original file and creation of a new file. No file history is lost, but it may make reverting to previous versions more difficult.

3. It requires a YAML-style deployment. I imagine it could be implemented with other methods with some changes.

## Thanks for reading!

I hope this method is helpful or helps you think of a better way to enable drafting in Docusaurus! Thanks for stopping by.
