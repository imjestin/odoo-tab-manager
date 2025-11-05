// AI Services Dropdown Handler
(function() {
  'use strict';
  
  document.addEventListener('DOMContentLoaded', function() {
    const aiButton = document.getElementById('aiServicesButton');
    const aiDropdown = document.getElementById('aiServicesDropdown');
    
    if (!aiButton || !aiDropdown) {
      return;
    }
    
    // Toggle dropdown on button click
    aiButton.addEventListener('click', function(e) {
      e.stopPropagation();
      aiDropdown.classList.toggle('hidden');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
      const target = e.target;
      
      // If clicking on a link inside the dropdown, close after a delay
      if (target.closest && target.closest('a') && aiDropdown.contains(target.closest('a'))) {
        setTimeout(function() {
          aiDropdown.classList.add('hidden');
        }, 200);
        return;
      }
      
      // Close dropdown when clicking outside
      if (!aiDropdown.contains(target) && !aiButton.contains(target)) {
        aiDropdown.classList.add('hidden');
      }
    });
  });
})();

