export const sanitizeHTML = (html) => {
    if (!html) {
      return '';
    }
    const element = document.createElement('div');
    element.innerHTML = html;
  
    if (element.innerText.trim().length === 0) {
      return element.innerHTML;
    }
  
    return element.innerText || element.textContent;
};