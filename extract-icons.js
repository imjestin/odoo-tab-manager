// Script to extract SVG codes from React Icons
const { FaCode, FaUser, FaNewspaper, FaBriefcase } = require('react-icons/fa');

// Function to extract SVG path from React Icon
function extractSVG(iconComponent) {
  const svgString = iconComponent().props.children;
  return svgString;
}

// Extract icons
console.log('Developer Icon (FaCode):');
console.log(extractSVG(FaCode));

console.log('\nUser Icon (FaUser):');
console.log(extractSVG(FaUser));

console.log('\nNews Icon (FaNewspaper):');
console.log(extractSVG(FaNewspaper));

console.log('\nConsultant Icon (FaBriefcase):');
console.log(extractSVG(FaBriefcase));
