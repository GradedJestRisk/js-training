import './export-named.js';

// CJS: import synchrone
// ESM:
// - import asynchrone par défaut
// - voir si await import est fonctionnel => à priori pas

(async () => {
    console.log('foo');
    import './export-named.js';
})();


