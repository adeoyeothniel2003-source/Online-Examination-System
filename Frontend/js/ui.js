/* Shared UI: mobile nav toggle, active-link highlight, standard footer injection. */
(function () {
    'use strict';

    var FOOTER_HTML =
        '<div class="footer-inner">' +
            '<div>' +
                '<div class="footer-brand">Online Examination System</div>' +
                '<p>A secure digital examination platform operated by ' +
                'Obafemi Awolowo University, Ile-Ife.</p>' +
            '</div>' +
            '<div>' +
                '<h4>Quick Links</h4>' +
                '<ul>' +
                    '<li><a href="index.html">Home</a></li>' +
                    '<li><a href="login.html">Student Login</a></li>' +
                    '<li><a href="admin-login.html">Admin Login</a></li>' +
                '</ul>' +
            '</div>' +
            '<div>' +
                '<h4>Support</h4>' +
                '<ul>' +
                    '<li><a href="mailto:support@oauife.edu.ng">Contact Support</a></li>' +
                    '<li><a href="index.html#how-it-works">Help &amp; FAQ</a></li>' +
                '</ul>' +
            '</div>' +
        '</div>' +
        '<div class="footer-bottom">' +
            '&copy; 2026 Obafemi Awolowo University · Online Examination System' +
        '</div>';

    var EYE_SVG =
        '<svg class="icon-eye" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
        'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/>' +
        '<circle cx="12" cy="12" r="3"/></svg>' +
        '<svg class="icon-eye-off" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
        'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-6.5 0-10-7-10-7a19.5 19.5 0 0 1 5.06-5.94"/>' +
        '<path d="M9.9 4.24A10.94 10.94 0 0 1 12 4c6.5 0 10 7 10 7a19.5 19.5 0 0 1-3.17 4.19"/>' +
        '<path d="M1 1l22 22"/><path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/></svg>';

    function attachPasswordToggle(input) {
        if (input.dataset.pwToggle === '1') return;
        input.dataset.pwToggle = '1';

        var wrap = document.createElement('div');
        wrap.className = 'password-field';
        input.parentNode.insertBefore(wrap, input);
        wrap.appendChild(input);

        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'password-toggle';
        btn.setAttribute('aria-label', 'Show password');
        btn.setAttribute('aria-pressed', 'false');
        btn.innerHTML = EYE_SVG;
        wrap.appendChild(btn);

        btn.addEventListener('click', function () {
            var showing = input.type === 'text';
            input.type = showing ? 'password' : 'text';
            btn.setAttribute('aria-pressed', showing ? 'false' : 'true');
            btn.setAttribute('aria-label', showing ? 'Show password' : 'Hide password');
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        document.querySelectorAll('input[type="password"]').forEach(attachPasswordToggle);
        // Re-attach when new password inputs are added later (e.g. admin forms shown dynamically)
        if (typeof MutationObserver !== 'undefined') {
            new MutationObserver(function (mutations) {
                mutations.forEach(function (m) {
                    m.addedNodes && m.addedNodes.forEach(function (n) {
                        if (n.nodeType !== 1) return;
                        if (n.matches && n.matches('input[type="password"]')) attachPasswordToggle(n);
                        if (n.querySelectorAll) {
                            n.querySelectorAll('input[type="password"]').forEach(attachPasswordToggle);
                        }
                    });
                });
            }).observe(document.body, { childList: true, subtree: true });
        }

        // Standardise every footer that opts-in via data-standard-footer
        document.querySelectorAll('footer[data-standard-footer]').forEach(function (f) {
            f.innerHTML = FOOTER_HTML;
        });

        // Mobile nav toggle
        var toggle = document.querySelector('.nav-toggle');
        var nav = document.getElementById('primaryNav');
        if (toggle && nav) {
            toggle.addEventListener('click', function () {
                var open = nav.classList.toggle('open');
                toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            });
        }

        // Highlight active nav link
        var current = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
        document.querySelectorAll('.nav-links a').forEach(function (a) {
            var href = (a.getAttribute('href') || '').toLowerCase();
            if (href === current) {
                a.setAttribute('aria-current', 'page');
                a.classList.add('active');
            }
        });
    });
})();
