# MasonGit

Welcome!<br>

This project was inspired by my GitHub student package privileges being taken away since I graduated.
Instead of paying for my private repositories I decided I'd make my own git server.

This project was intended to be a complete Git ecosystem and has 2 components:

## Git server

It is currently possible to access a git repository (clone, push, pull) I have set up at:
ssh://gituser@mpimentel947.ddns.net:9422/home/gituser/repositories/MasonGit.git

user: gituser<br>
passwd: masongit

(assuming DDNS and my home router is working when you try it!)

A big TODO here is allowing users to create accounts and initialize their own repositories

<img src="https://github.com/snxfz947/MasonGit/blob/master/public/images/Screen10.png"><br>_Server setup_

## Git UI (MasonGit)

Visit at http://mpimentel947.ddns.net:9474

The main features the UI include:

* List the commits for a selected repository on the Git server

TODO: add options for a certain number of commits per page
* View the diffs of the commits

TODO: add more information such as line numbers (unfortunately not readily available by the NodeGit library...)
* Clone repositories to the Git server

TODO: add SSH authentication - currently only works for public repositories that do not require authentication

<img src="https://github.com/snxfz947/MasonGit/blob/master/public/images/Screen1.png"><br>_Selecting a repository to view_

<img src="https://github.com/snxfz947/MasonGit/blob/master/public/images/Screen2.png"><br>_Viewing the commits for MockBookstorePre_

<img src="https://github.com/snxfz947/MasonGit/blob/master/public/images/Screen3.png"><br>_Viewing the diff for commit "Fixing checkout behaviour"_

<img src="https://github.com/snxfz947/MasonGit/blob/master/public/images/Screen4.png" width="500"><br>

<img src="https://github.com/snxfz947/MasonGit/blob/master/public/images/Screen5.png" width="500"><br>_Cloning a repository_

<img src="https://github.com/snxfz947/MasonGit/blob/master/public/images/Screen6.png" width="500"><br>

<img src="https://github.com/snxfz947/MasonGit/blob/master/public/images/Screen7.png" width="500"><br>_Error handling_

<img src="https://github.com/snxfz947/MasonGit/blob/master/public/images/Screen8.png" width="500"><br>_Successful clone_

<img src="https://github.com/snxfz947/MasonGit/blob/master/public/images/Screen9.png"><br>_Viewing Dotify commits_
