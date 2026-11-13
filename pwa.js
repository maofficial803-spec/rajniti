/* PWA: service worker register + naya update aate hi apne aap reload */
(function () {
    if (!('serviceWorker' in navigator) || !/^https?:$/.test(location.protocol)) return;   // file:// par nahi chalta
    var reloaded = false;
    function note(t) {
        var d = document.createElement('div');
        d.style.cssText = 'position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:100000;background:#101a29;border:1px solid #e8a33d;color:#efe6d2;padding:10px 18px;border-radius:12px;font:600 14px sans-serif';
        d.textContent = t; document.body.appendChild(d); setTimeout(function () { d.remove(); }, 2500);
    }
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('sw.js').then(function (reg) {
            setInterval(function () { reg.update(); }, 60 * 60 * 1000);          // har ghante naya version dhoondo
            reg.addEventListener('updatefound', function () { note('Naya update mil gaya...'); });
        }).catch(function () {});
        navigator.serviceWorker.addEventListener('controllerchange', function () {
            if (reloaded) return; reloaded = true; note('Update ho gaya. Game dobara khul raha hai'); setTimeout(function () { location.reload(); }, 900);
        });
    });
})();
