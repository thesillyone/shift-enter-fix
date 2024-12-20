(function() {
    'use strict';

    console.log("Shift+Enter Comment Fix extension loaded.");

    // Function to attach the event listener to a textarea
    function attachListener(textarea) {
        if (textarea.dataset.shiftEnterListenerAttached) return;
        textarea.dataset.shiftEnterListenerAttached = true;
        textarea.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && e.shiftKey) {
                e.preventDefault();
                e.stopPropagation(); 

                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const value = textarea.value;
                textarea.value = value.slice(0, start) + "\n" + value.slice(end);
                textarea.selectionStart = textarea.selectionEnd = start + 1;
            }
        }, true); // Use capturing phase to intercept early
    }

    function init() {
        const textareas = document.querySelectorAll('textarea.field__entry');
        textareas.forEach(attachListener);
    }

    init();

    // Observe for dynamically added textareas
    const observer = new MutationObserver((mutations) => {
        for (let mutation of mutations) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // ELEMENT_NODE
                        const newTextareas = node.querySelectorAll && node.querySelectorAll('textarea.field__entry');
                        if (newTextareas && newTextareas.length > 0) {
                            newTextareas.forEach(attachListener);
                        }
                    }
                });
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();