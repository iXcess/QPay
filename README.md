# QPay

Plugin installed :
1. Chart.js - ref : http://www.chartjs.org/
2. Barcode scanner: 
  Installation : 
  - $ ionic cordova plugin add phonegap-plugin-barcodescanner@7.0.2
  - $ npm install --save @ionic-native/barcode-scanner
3. Accessing phone contacts - ref: https://ionicframework.com/docs/native/contacts/
4. progressbar.js - ref: https://kimmobrunfeldt.github.io/progressbar.js/

  `npm install progressbar.js --save` 

To generate splash screen and icon, set backend to pro to login

`ionic config set backend legacy -g`
`ionic config set backend pro -g`
then,
`ionic cordova resources`

Main green color code 
#83CBB7

## Changelog

### v0.0.2
- done homepage UI 
- done deposit page UI
- partial done promotionList page UI 
- set universal font
- js barebone for homepage
- js and html barebone of the deposit/withdrawal page
- js and html barebone for expenditure summary
- js plugin for qr-scanner and qr code generator
- chart.js in portfolio page
- js barebone for promotion page and advertisement page
- html for settings

### v0.0.3
- resolve issue 2 & 6 (homepage does not fit screen size and android back button)
- style portfolio page
- change sidebar wording

### v0.0.5
- resolve graphs sometime doesnt load out issue
- change the portfolio 1st & 3rd slide wording
- display 3 lines in 2nd slide in portfolio graph
- change sidebar expenditure to transaction
- promotion detail page styling
- promotion list banner logo

### v0.0.6
- add in logo icon
- invest now page styling
- integrate API for savings history
- Complete split the bill
- completed qr scanning
- added in icon for contact list







