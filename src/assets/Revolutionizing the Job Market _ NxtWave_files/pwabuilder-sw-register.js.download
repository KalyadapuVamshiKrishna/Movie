// This is the "Offline copy of pages" service worker

// Check that service workers are registered
if ('serviceWorker' in navigator) {
   // Use the window load event to keep the page load performant
   window.addEventListener('load', () => {
      // Add this below content to your HTML page, or add the js file to your page at the very top to register service worker
      if (navigator.serviceWorker.controller) {
         console.log(
            '[PWA Builder] active service worker found, no need to register'
         )
      } else {
         // Register the ServiceWorker
         navigator.serviceWorker
            .register('OneSignalSDKWorker.js', {
               scope: './'
            })
            .then((reg) => {
               console.log(
                  `Service worker has been registered for scope:${reg.scope}`
               )
            })
      }
   })
}
