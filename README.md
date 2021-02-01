# WSBsignal
WSBsignal is an open source content filter and feed aggregator for WallStreetBets

Main site: https://wsbsignal.com

![WSBSignal.com](https://wsbsignal.com/img/social-card.png)

# Getting Started
Clone the Git repository or download and install the zip file

Edit contribute and issue a pull request as you see fit.

Built on the VanillaHTML framework with NodeJS

# Pages
If you add new pages, update js/routes.js

Pages are loaded via the page query parameter. So https://wsbsignal.com/?page=terms will load the terms.html page. This is setup in routes.js

# Components
Web components can be built as single HTML files. CSS at the top, HTML in the middle and Javascript at the bottom. Include all Javascript between script tags at the bottom of the file, don't use inline Javascript.

See the examples in components/

These can be loaded via the utils.loadModule('components/header.html','header');

1st parameter is the path to the file, 2nd is the dom ID to inject the code.

This allows for modular and 3rd party components to be added with ease.

# Resources
https://vanillahtml.com/

https://wsbsignal.com/

https://jamesbachini.com

https://twitter.com/wsbsignalcom


# Contribute
If anyone would like to add code to the project, build templates or make improvements please do so via a pull request.

I'm keen to keep it lightweight but so anything that's not core should be setup as a 3rd party component.

# To Do
Tidy up and improve layouts
Add more pages for different analytics
Sentiment analysis
Improve language and post scoring system
