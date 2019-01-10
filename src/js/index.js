window.onload = function() {
  document.querySelector('.js-credit-card-number').oninput = function() {
    this.value = cc_format(this.value);
  };

  var checkedElem = document.querySelector('.js-store-the-card');
  checkedElem.addEventListener('click', showEmailInputField);
  checkedElem.addEventListener('click', hideEmailInputField);
  document.querySelector('.js-form').addEventListener('submit', helpFunc);
  document.querySelector('.js-credit-card-number').addEventListener('keydown', checkDigit);
  
  function checkDigit(event) {
   var code = (event.which) ? event.which : event.keyCode;
   if ((code < 48 || code > 57) && (code > 31)) {
     event.preventDefault();
   }
  }

  function showEmailInputField() {
    if (checkedElem.checked) {
      var parentForm =  checkedElem.form;
      var emailInputField = parentForm.querySelector('.js-email-field');
      emailInputField.classList.add('email-field-open');
      parentForm.querySelector('.js-email-input').setAttribute('required','required');
    }
  }

  function hideEmailInputField() {
    if (!checkedElem.checked) {
      var parentForm = checkedElem.form;
      var emailInputField = parentForm.querySelector('.js-email-field');
      emailInputField.classList.remove('email-field-open');
      parentForm.querySelector('.js-email-input').removeAttribute('required','required');
    } 
  }

  function helpFunc(event) {
    event.preventDefault();
    loaderFunc();  
    setTimeout(function(){
      return validateForm(event) ;
    },2000);
  }

  function loaderFunc() {
    var loader = document.querySelector(".loader");
    var loaderWrapper = document.querySelector(".loader-wrapper");
    loader.classList.add('visible');
    loaderWrapper.classList.add('visible');
    setTimeout(function(){
      loader.classList.remove('visible');
      loaderWrapper.classList.remove('visible');
    },2000);
  }

  function validateForm(event) {
    var result = [];
    var subResult;
    var form = event.target;
    var number = form.querySelector('.js-credit-card-number');
    resetError(number.parentElement);
    subResult = checkNumber(number);
    result.push(subResult);
    var monthEx = form.querySelector('.js-month-ex');
    var yearEx = form.querySelector('.js-year-ex');
    resetError(monthEx.parentElement.parentElement.parentElement);
    subResult = checkExpiryDate(monthEx, yearEx);
    result.push(subResult);
    var cvvCode = form.querySelector('.js-cvv-code');
    resetError(cvvCode.parentElement.parentElement.parentElement);
    subResult = checkCVV(cvvCode);
    result.push(subResult);
    var email = form.querySelector('.js-email-input');
    resetError(email.parentElement);
    subResult = checkEmail(email);
    result.push(subResult);
    if (result.every(isTrue)) {
      document.querySelector('.js-success-message').classList.add('visible');
    }
  }

  function cc_format(value) {
    var v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    var matches = v.match(/\d{4,16}/g);
    var match = matches && matches[0] || '';
    var parts = [];
    for (var i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i+4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  }

  function showError(container, errorMessage) {
    container.classList.add('error');
    var msgElem = document.createElement('p');
    msgElem.classList.add('error-message');
    msgElem.innerHTML = errorMessage;
    container.appendChild(msgElem);
  }

  function resetError(container) {
    container.classList.remove('error');
    if (container.lastChild.className === 'error-message') {
      container.lastChild.classList.remove('error-message');
      container.removeChild(container.lastChild);
    }
  }

  function isTrue(element) {
    return element === true;
  }

  function checkNumber(numberIn) {
    if (numberIn.value === '') {
      showError(numberIn.parentElement, 'This field is required. Please, enter credit card number');
      return false;
    } else if (numberIn.value.length !== 19) {
      showError(numberIn.parentElement, 'Please, enter valid number, 16 digits');
      return false;
    } else  {
      return true;
    } 
  }

  function checkEmail(emailIn) {
    var emailRe = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (emailIn.required) {
      if (emailIn.value === '' || emailIn.value === ' ') {
        showError(emailIn.parentElement, 'This field is required. Please, enter email');
        return false;
      } else if (!emailIn.value.match(emailRe)) {
        showError(emailIn.parentElement, 'Please, enter valid email');
        return false;
      } else if (emailIn.value.match(emailRe)) {
        return true;
      }    
     }
    return true;
  }

  function checkCVV(cvvIn) {
    var cvvRe = /^[0-9]{3,4}$/;
    if (cvvIn.value === '') {
      showError(cvvIn.parentElement.parentElement.parentElement, 'This field is required. Please, enter cvv code');
      return false;
    } else if (!cvvIn.value.match(cvvRe)) {
      showError(cvvIn.parentElement.parentElement.parentElement, 'Please, enter valid CVV code');
      return false;
    } else if (cvvIn.value.match(cvvRe)) {
      return true;
    }    
    return true;
  }

  function checkExpiryDate(monthIn, yearIn) {
    var nowDate = new Date();
    var month = nowDate.getMonth() + 1;
    var year = nowDate.getFullYear() % 2000;
    if (monthIn.selectedIndex === 0 || yearIn.selectedIndex === 0) {
      showError(monthIn.parentElement.parentElement.parentElement, 'This fields are required. Please, enter expiration date');
      return false;
    }
    else if (monthIn.selectedIndex < month && yearIn.selectedIndex <= year) {
      showError(monthIn.parentElement.parentElement.parentElement, 'Your expiration date is before today. Please, enter valid expiration date');
      return false;
    } else {
      return true;
    }
  }
};