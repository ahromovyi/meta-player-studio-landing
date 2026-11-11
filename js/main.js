/**
 * Meta Player Studio — landing
 * 1. Перемикач «Показати логіку»
 * 2. Інтерактивна «Анатомія лендингу»
 * 3. Форма заявки
 */

(function () {
  'use strict';

  /* ---------- 1. Logic toggle ---------- */
  function initLogicToggle() {
    var toggle = document.querySelector('[data-logic-toggle]');
    var label = document.querySelector('[data-logic-label]');
    if (!toggle) return;

    toggle.addEventListener('click', function () {
      var isOn = document.body.classList.toggle('show-logic');
      toggle.setAttribute('aria-pressed', String(isOn));
      if (label) label.textContent = isOn ? 'Сховати логіку' : 'Показати логіку';
    });
  }

  /* ---------- 2. Anatomy ---------- */
  var ANATOMY = [
    { n: '01', title: 'Перший екран', text: 'Відповідає на три питання: що це, для кого, що робити далі.' },
    { n: '02', title: 'Проблема', text: 'Клієнт має впізнати себе раніше, ніж побачить пропозицію.' },
    { n: '03', title: 'Рішення', text: 'Не «що ми робимо», а «що зміниться у вас».' },
    { n: '04', title: 'Докази', text: 'Приклади, процес, прозорі умови.' },
    { n: '05', title: 'Заперечення', text: 'Відповіді на сумніви до того, як їх озвучать.' },
    { n: '06', title: 'Дія', text: 'Одна зрозуміла кнопка і мінімум полів.' }
  ];

  function initAnatomy() {
    var root = document.querySelector('[data-anatomy]');
    if (!root) return;

    var buttons = root.querySelectorAll('.anatomy__btn');
    var bars = root.querySelectorAll('.anatomy__progress span');
    var elN = root.querySelector('[data-anatomy-n]');
    var elTitle = root.querySelector('[data-anatomy-title]');
    var elText = root.querySelector('[data-anatomy-text]');

    function select(index) {
      var item = ANATOMY[index];
      if (!item) return;

      buttons.forEach(function (btn, i) {
        var active = i === index;
        btn.classList.toggle('is-active', active);
        btn.setAttribute('aria-pressed', String(active));
      });
      bars.forEach(function (bar, i) {
        bar.classList.toggle('is-on', i <= index);
      });

      elN.textContent = item.n;
      elTitle.textContent = item.title;
      elText.textContent = item.text;
    }

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        select(Number(btn.dataset.index));
      });
    });
  }

  /* ---------- 3. Lead form ---------- */

  /**
   * TODO: підключити реальну відправку.
   * Варіанти: Formspree / Basin (fetch на їхній endpoint),
   * Telegram Bot API через власний бекенд, або свій API.
   * Функція має повернути Promise.
   */
  function sendLead(data) {
    // eslint-disable-next-line no-console
    console.info('[lead]', data);
    return Promise.resolve();
  }

  function initForm() {
    var form = document.querySelector('[data-lead-form]');
    var success = document.querySelector('[data-form-success]');
    var error = document.querySelector('[data-form-error]');
    var reset = document.querySelector('[data-form-reset]');
    if (!form || !success) return;

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var name = form.elements.name;
      var contact = form.elements.contact;
      var valid = true;

      [name, contact].forEach(function (input) {
        var empty = !input.value.trim();
        input.setAttribute('aria-invalid', String(empty));
        if (empty) valid = false;
      });

      error.hidden = valid;
      if (!valid) {
        (name.value.trim() ? contact : name).focus();
        return;
      }

      var data = {
        name: name.value.trim(),
        contact: contact.value.trim(),
        about: form.elements.about.value.trim()
      };

      var submit = form.querySelector('[type="submit"]');
      submit.disabled = true;

      sendLead(data)
        .then(function () {
          form.reset();
          form.hidden = true;
          success.hidden = false;
        })
        .catch(function () {
          error.textContent = 'Не вдалося надіслати. Спробуйте ще раз або напишіть нам напряму.';
          error.hidden = false;
        })
        .finally(function () {
          submit.disabled = false;
        });
    });

    if (reset) {
      reset.addEventListener('click', function () {
        success.hidden = true;
        form.hidden = false;
        form.elements.name.focus();
      });
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    initLogicToggle();
    initAnatomy();
    initForm();
  });
})();
