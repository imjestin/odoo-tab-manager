// AI Services Dropdown Handler
(function() {
  'use strict';
  
  function openDropdown(dropdown) {
    dropdown.classList.remove('opacity-0', 'invisible', 'scale-95', 'translate-y-2', 'pointer-events-none');
    dropdown.classList.add('opacity-100', 'visible', 'scale-100', 'translate-y-0', 'pointer-events-auto');
  }
  
  function closeDropdown(dropdown) {
    dropdown.classList.remove('opacity-100', 'visible', 'scale-100', 'translate-y-0', 'pointer-events-auto');
    dropdown.classList.add('opacity-0', 'invisible', 'scale-95', 'translate-y-2', 'pointer-events-none');
  }
  
  function isDropdownOpen(dropdown) {
    return dropdown.classList.contains('opacity-100') && !dropdown.classList.contains('opacity-0');
  }
  
  document.addEventListener('DOMContentLoaded', function() {
    const aiButton = document.getElementById('aiServicesButton');
    const aiDropdown = document.getElementById('aiServicesDropdown');
    
    if (!aiButton || !aiDropdown) {
      return;
    }
    
    // Toggle dropdown on button click
    aiButton.addEventListener('click', function(e) {
      e.stopPropagation();
      if (isDropdownOpen(aiDropdown)) {
        closeDropdown(aiDropdown);
      } else {
        openDropdown(aiDropdown);
      }
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
      const target = e.target;
      
      // If clicking on a link inside the dropdown, close after a delay
      if (target.closest && target.closest('a') && aiDropdown.contains(target.closest('a'))) {
        setTimeout(function() {
          closeDropdown(aiDropdown);
        }, 200);
        return;
      }
      
      // Close dropdown when clicking outside
      if (!aiDropdown.contains(target) && !aiButton.contains(target)) {
        closeDropdown(aiDropdown);
      }
    });
  });
})();

