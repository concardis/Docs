# Payengine documentation

## Tech Stack
### Base
 - [https://angularjs.org/](https://angularjs.org/)
 - [https://getbootstrap.com/](https://getbootstrap.com/)

### UI
 - [Swagger UI](https://swagger.io/swagger-ui/)
 - [Monarch UI](https://agileui.com/demo/monarch/demo/admin-template/index.html)

## Getting started

### NPM 
Get and install Node.js for your system.  [https://nodejs.org/en/](https://nodejs.org/en/)

### Grunt
Get and install Grunt for your system.  [https://gruntjs.com/getting-started](https://gruntjs.com/getting-started)

### Get the Docs
#### By cloning
`https://github.com/concardis/Docs.git`

### Start
Move into the directory and run
`grunt`

## Folder overview
#### Content
 - **searchIndex.json** manual created JSON to search the Site. App.js /search
 - **swagger.json** current beautified Swagger file. Used by Swagger UI /buildyourown/restapi 

#### CSS
 - **monarch** Monarch UI 
 - **payengineDocs.css** payengine modifications
 - **swagger-ui.css** swagger UI CSS

#### img
 - **images** new image folder, use this one

#### js
 - **app.js** AngularJS 

#### node_modules
 - **node.js** Node.JS
 - **grunt** grunt use to code local

#### partials
 - **Menus** pages with menus have own controllers in app.js for page routing and better overview
 - **restApi.html** restapi uses Swagger UI -> /templates/swagger-ui.html
 - **widget.html** sample integration of the widget

#### templates
 - **swagger-ui.html** generates a documentation out of the swagger file /content/swagger.json

#### uploads
 - **images** old Wordpress image folder. Store new images in /img