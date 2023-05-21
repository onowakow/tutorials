# Create a git project and link to Github

Most projects begin with creating a new git repository and linking to a remote repository like Github.

1. Install git. Use the [Official Git Docs](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) or find a tutorial elsewhere.

2. Navigate to the folder where you want the repository. In the bash terminal, you can navigate using `cd` like the following:

   ```bash
   cd Documents/my-project
   ```

3. Add a file so your folder is not empty. Creating a README.md file will suffice. You can use the `touch` command or simply create a file how you normally would.

   ```bash
   touch README.md
   ```

4. Then, run `git init`, which will initialize a local repo. This repo will be stored on your local machine. Below shows the initialize command followed by a success message.
   ```bash
   git init
   Initialized empty Git repository in /home/user/Documents/tutorials/.git/
   ```
   If you look in your directory (either using a folder explorer or `ls`), you will see that nothing seemed to change. This is because git creates hidden files. Run `ls -a` to see the hidden files that git added.
