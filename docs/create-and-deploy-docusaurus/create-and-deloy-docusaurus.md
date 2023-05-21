# Deploy Docusaurus to Azure Static Web Apps using Azure DevOps

Documentation is an necessary element of most projects. Facebook's open source project, [Docusaurus](https://docusaurus.io/docs), makes creating beautiful and clean documentation easy. We will deploy the docs using Azure Static Web Apps with an automatic deployment when changes are pushed to the Github repo.

These docs will assume basic knowledge of Git, Node Package Manager (npm), and markdown. Tutorials are readily available for all of these topics across the internet for the unfamiliar.

## Install Docusaurus

We will begin by creating a Docusaurus app. Official documentation for this step is available at [Docusaurus Docs: Scaffold Project Website](https://docusaurus.io/docs/installation#scaffold-project-website).

1. Navigate to a new empty directory.

2. Run the `create-docusaurus` executable via Node Package eXecute(npx) package. I will call the project `docusaurus-example`, but feel free to change the project name.

   ```
   npx create-docusaurus@latest docusaurus-example classic
   ```

   If all goes well, you should see an output similar to the following:
   ![Successful run of create-docusaurus begins with [Success] Created docusaurus-example](./media/create-docusaurus-output.png)

3. Serve the project locally. Run the `start` script to serve the docs to the default url of http://localhost:3000. You will need to navigate to the folder titled `docusaurus-example` before running the start script.

   ```
   cd docusaurus-example
   npm start
   ```

   When you open your browser to http://localhost:3000, you should see a screen like pictured below:

   ![New project default screen](./media/docusaurus-new-project-default.png)

   From here, you can customize the docs to fit your needs. We will leave the docs in their default state for the purpose of this tutorial.

## Push Project to Azure DevOps

Docusaurus can be deployed from a variety of cloud repos like Github. This tutorial will use Azure DevOps so that we can make use of the Pipelines feature.

1. First, navigate to Azure DevOps at https://dev.azure.com and create a new project within your organization. If you haven't used Azure DevOps before, you may need to configure it to work with your Microsoft account. I created an organization and a new project called "tutorials".

2. Go to Repos in the sidebar. You should see a message like "Tutorials is empty. Add some code." Copy the HTTPs link and save it for later. We will use the "Generate Git Credentials" button later.

   ![New DevOps repo shows an empty repo, a repo link, and a button labeled Generate Git Credentials](./media/azure-devops-new-repo.png)

3. Initialize an new git repo in your docusaurus project. Navigate in your terminal to the docusaurus project root. In my case, the project root is /docusaurus-example.

   **a**. Initialize a repo and add your Docusaurus files:

   ```
   git init
   git add .
   ```

   **b**. Make your initial commit:

   ```
   git commit -m "Create new docusaurus project"
   ```

   **c**. Rename the default branch from "master" to "main". This step is not necessary, but some developers prefer it

   ```
   git branch -M main
   ```

   **d**. Add the Azure DevOps repo as your remote repository. For this step, paste your HTTPS link from the Azure DevOps Repo page as shown in step 2 of this section:

   ```
   git remote add origin https://onowakow@dev.azure.com/onowakow/My-Tutorials/_git/My-Tutorials
   ```

   **Your IDE should prompt you for a password.** This password is found by clicking "Generate Git Credentials" in your Azure DevOps Repo.

   **Note**: "origin" is the default name for a remote repo in git. Feel free to name it whatever is appropriate, but know that certain git command shortcuts may not work.

## Configure a Static Web App

1. Navigate to the Azure Portal at https://portal.azure.com/ and create an account if you don't already have one. You can create an account for free and get $200 promotional credit following this Microsoft link https://azure.microsoft.com/en-us/free/ (as of May 2023).

   Azure Static Web Apps have a great hobby tier that is always free. Double check that the hobby tier is still free if you are worried about incurring costs. In my experience, running small projects on most serverless services is free or less than $5 a month.

2. In the top search bar of the Azure Portal, search for and select Static Web Apps. Click the button to "Create Static Web App".

   ![Searching for Static Web App in Azure Portal](./media/find-static-web-apps.png)
