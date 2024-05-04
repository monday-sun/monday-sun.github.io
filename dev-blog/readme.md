Dev-Blog
A jekyll server to power the blogs portion of [monday-sun's github pages](https://monday-sun.github.io/).

Project Structure
The source code for this project is located in the dev-blog directory.

Commands
The project has several commands defined in the targets section of the configuration.

Install
To install the necessary dependencies for this project, run the following command:

`bundle install`

Build
To build the project, run the following command:

`bundle exec jekyll build --baseurl https://monday-sun.github.io`

Serve Drafts
To serve the project with drafts, run the following command:

`bundle exec jekyll serve --drafts`

Serve
To serve the project, run the following command:

`bundle exec jekyll serve`
