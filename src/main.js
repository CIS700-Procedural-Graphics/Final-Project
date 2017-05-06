import App from './App';


(function main() {
  let app = new App();
  window.addEventListener('load', app.onLoad.bind(app));
  window.addEventListener('resize', app.onResize.bind(app), false);
})();
