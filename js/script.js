window.addEventListener('DOMContentLoaded', () => {
  // Tabs
  const tabs = document.querySelectorAll('.tabheader__item'),
    tabContent = document.querySelectorAll('.tabcontent'),
    tabContentItem = document.querySelector('.tabheader__items');

  function hideTabContent() {
    tabContent.forEach((item) => {
      item.style.display = 'none';
    });

    tabs.forEach((item) => {
      item.classList.remove('tabheader__item_active');
    });
  }

  function showTabContent(i = 0) {
    tabContent[i].style.display = 'block';
    tabs[i].classList.add('tabheader__item_active');
  }

  hideTabContent();
  showTabContent();

  tabContentItem.addEventListener('click', (event) => {
    const target = event.target;

    if (target && target.classList.contains('tabheader__item')) {
      tabs.forEach((item, i) => {
        if (target == item) {
          hideTabContent();
          showTabContent(i);
        }
      });
    }
  });

  // Timer

  const deadline = '2023-05-27';

  function getTimeRemaining(endtime) {
    let days, hours, minutes, seconds;
    const t = Date.parse(endtime) - Date.parse(new Date());

    if (t <= 0) {
      days = 0;
      hours = 0;
      minutes = 0;
      seconds = 0;
    } else {
      (days = Math.floor(t / (1000 * 60 * 60 * 24))),
        (hours = Math.floor((t / (1000 * 60 * 60)) % 24)),
        (minutes = Math.floor((t / (1000 * 60)) % 60)),
        (seconds = Math.floor((t / 1000) % 60));
    }

    return {
      total: t,
      days: days,
      hours: hours,
      minutes: minutes,
      seconds: seconds,
    };
  }

  function getZero(num) {
    if (num >= 0 && num < 10) {
      return `0${num}`;
    } else {
      return num;
    }
  }

  function setClock(selector, endtime) {
    const timer = document.querySelector(selector),
      days = timer.querySelector('#days'),
      hours = timer.querySelector('#hours'),
      minutes = timer.querySelector('#minutes'),
      seconds = timer.querySelector('#seconds'),
      timerInterval = setInterval(updateClock, 1000);

    updateClock();

    function updateClock() {
      const t = getTimeRemaining(endtime);

      days.innerHTML = getZero(t.days);
      hours.innerHTML = getZero(t.hours);
      minutes.innerHTML = getZero(t.minutes);
      seconds.innerHTML = getZero(t.seconds);

      if (t.total < 0) {
        clearInterval(timerInterval);
      }
    }
  }

  setClock('.timer', deadline);

  // Modal

  const btnModal = document.querySelectorAll('[data-modal]'),
    modal = document.querySelector('.modal');

  // Моё решение

  function openModal() {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; //Запрешает сколить когда открыто окно модал
    clearTimeout(modalTimerId);
  }

  btnModal.forEach((i) => {
    i.addEventListener('click', openModal);
  });

  function modalClose() {
    modal.style.display = 'none';
    document.body.style.overflow = ''; //Разрешает скролить когда закрыли окно
  }


  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.getAttribute('data-close') == '') { //закрывание модельного окна через дата атрибут (e.target.getAttribute('data-close') == '')
      modalClose();
    }
  });

  document.addEventListener('keydown', (e) => {
    //Закрытие окна по кнопке 'Esc'
    if (e.code === 'Escape') {
      modalClose();
    }
  });
  // Решение из урока
  // btnModal.forEach((btn) => {
  //     btn.addEventListener('click', () => {
  //         modal.classList.add('show');
  //         modal.classList.remove('hide');
  //         document.body.style.overflow = 'hidden';  //Запрешает сколить когда открыто окно модал

  //     })
  // })

  // closeModal.addEventListener('click', () => {
  //     modal.classList.add('hide');
  //     modal.classList.remove('show');
  //     document.body.style.overflow = '';  //Разрешает скролить когда закрыли окно
  // })

  const modalTimerId = setTimeout(openModal, 50000);

  function showModalByScroll() {
    if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
      //открывание модельного окна у клиента в конце строници когда он долистал до конца
      openModal();
      window.removeEventListener('scroll', showModalByScroll); //остановка функции по открыванию модельного окна после скрола в конец страници
    }
  }

  window.addEventListener('scroll', showModalByScroll);

  // Использование классов для карточек

  class MenuCard {
    constructor(src, alt, title, descr, price, parentSelector, ...classes) {
      this.src = src;
      this.alt = alt;
      this.title = title;
      this.descr = descr;
      this.price = price;
      this.classes = classes;
      this.parent = document.querySelector(parentSelector);
      this.transfer = 75;
      this.changeToRUB();
    }

    changeToRUB() {
      this.price = this.price * this.transfer;
    }

    render() {
      const element = document.createElement('div');

      if (this.classes.length === 0) {
        this.element = 'menu__item';
        element.classList.add(this.element);
      } else {
        this.classes.forEach((className) => element.classList.add(className));
      }

      element.innerHTML = `
        <img src=${this.src} alt=${this.alt}>
        <h3 class="menu__item-subtitle">${this.title}</h3>
        <div class="menu__item-descr">${this.descr}</div>
        <div class="menu__item-divider"></div>
        <div class="menu__item-price">
            <div class="menu__item-cost">Цена:</div>
            <div class="menu__item-total"><span>${this.price}</span> руб/день</div>
        </div>
        `;
      this.parent.append(element);
    }
  }

  const getResource = async (url) => {
    const res = await fetch(url)

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, status:${res.status}`);
    }

    return await res.json();
 }

 getResource('http://localhost:3000/menu')
 .then(data => {
   data.forEach(({img, altimg, title, descr, price}) => {
     new MenuCard(img, altimg, title, descr, price, '.menu .container').render()
   });
 });

  // new MenuCard(
  //   'img/tabs/vegy.jpg',
  //   'vegy',
  //   'Меню "Фитнес"',
  //   'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
  //   9,
  //   '.menu .container',
  //   'menu__item'
  // ).render();

  // new MenuCard(
  //   'img/tabs/elite.jpg',
  //   'elite',
  //   'Меню “Премиум”',
  //   'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
  //   19,
  //   '.menu .container'
  // ).render();

  // new MenuCard(
  //   'img/tabs/post.jpg',
  //   'post',
  //   'Меню "Постное"',
  //   'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
  //   12,
  //   '.menu .container'
  // ).render();

  // Forms

  // const forms = document.querySelectorAll('form');

  // const messaga = {
  //   loading: 'Загрузка',
  //   success: 'Спасибо! Скоро мы с вами свяжимся',
  //   failure: 'Что-то пошло не так...',
  // };

  // forms.forEach((item) => {
  //   postData(item);
  // });

  // function postData(form) {
  //   form.addEventListener('submit', (e) => {
  //     e.preventDefault();

  //     const statusMessage = document.createElement('div');
  //     statusMessage.classList.add('status');
  //     statusMessage.textContent = messaga.loading;
  //     form.append(statusMessage);

  //     const request = new XMLHttpRequest();
  //     request.open('POST', 'server.php');

  //     // request.setRequestHeader('Content-type', 'multipart/from-data'); // Это писать не надо при связки new XMLHttpRequest() и FormData() иначи мы получаем пустой обькт
  //     const formData = new FormData(form);

  //     request.send(formData);

  //     request.addEventListener('load', () => {
  //       if (request.status === 200) {
  //         console.log(request.response);
  //         statusMessage.textContent = messaga.success;
  //         form.reset();
  //         setTimeout(() => {
  //           statusMessage.remove();
  //         }, 2000);
  //       } else {
  //         statusMessage.textContent = messaga.failure;
  //       }
  //     });
  //   });
  // }

  // JSON

  const forms = document.querySelectorAll('form');

  const messaga = {
    loading: 'img/form/spinner.svg',
    success: 'Спасибо! Скоро мы с вами свяжимся',
    failure: 'Что-то пошло не так...',
  };

  forms.forEach((item) => {
    bindPostData(item);
  });

  const postData = async (url, data) => {
     const res = await fetch(url, {
        method: "POST",
        headers: {
          'Content-type': 'application/json'
        },
        body: data
     })

     return await res.json();
  }

  function bindPostData(form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const statusMessage = document.createElement('div');
      statusMessage.src = messaga.loading;
      statusMessage.style.cssText = `
        display: block;
        margin: 0 auto;
      `;
      
      form.insertAdjacentElement('afterend', statusMessage);

      const formData = new FormData(form);

      const object = {};

      const json = JSON.stringify(Object.fromEntries(formData.entries()));

      
      postData('http://localhost:3000/requests', json)
      .then(data => {
        console.log(data);
        showThanksModal(messaga.success);
        form.reset();
        statusMessage.remove();
      }).catch(() => {
        showThanksModal(messaga.failure);
      }).finally(() => {
        form.reset();
      })
    });
  }

  //Оповещение пользователя

  function showThanksModal(messaga) {
    const prevModalDialog = document.querySelector('.modal__dialog');

    prevModalDialog.style.display = 'none';
    openModal();

    const thanksModal = document.createElement('div');
    thanksModal.classList.add('modal__dialog');
    thanksModal.innerHTML = `
        <div class="modal__content">
            <div data-close class="modal__close">×</div>
            <div class="modal__title">${messaga}</div>
        </div>
    `;

    document.querySelector('.modal').append(thanksModal);

    setTimeout(() => {
      thanksModal.remove();
      prevModalDialog.style.display = 'block';
      modalClose();
    }, 4000)
  }

 
});
