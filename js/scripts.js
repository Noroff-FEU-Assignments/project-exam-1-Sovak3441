const selectElement = selector => {
  const element = document.querySelector(selector);
  if(element) return element;
  throw new Error(`Something went wrong, make sure that ${selector} exists or is typed correctly`);
}

const scrollHeader = () => {
  const headerElement = selectElement("#header");
  if(this.scrollY >= 15) {
    headerElement.classList.add("activated");
  } else {
    headerElement.classList.remove("activated");
  }
}

window.addEventListener("scroll", scrollHeader);

const menuToggleIcon = selectElement("#menu-toggle-icon");
const toggleMenu = () => {
  const mobileMenu = selectElement("#menu");
  mobileMenu.classList.toggle("activated");
  menuToggleIcon.classList.toggle("activated");
}
menuToggleIcon.addEventListener("click", toggleMenu);

const formOpenBtn = selectElement("#search-icon");
const formCloseBtn = selectElement("#form-close-btn")
const searchFormContainer = selectElement("#search-form-container");
formOpenBtn.addEventListener("click", () => {
  searchFormContainer.classList.add("activated");
});
formCloseBtn.addEventListener("click", () => {
  searchFormContainer.classList.remove("activated");
});
window.addEventListener("keyup", event => {
  if(event.key === "Escape") {
    searchFormContainer.classList.remove("activated");
  }
});

const bodyElement = document.body;
const themeToggleBtn = selectElement("#theme-toggle-btn");
const currentTheme = localStorage.getItem("currentTheme");

if(currentTheme) {
  bodyElement.classList.add("light-theme");
}

themeToggleBtn.addEventListener("click", () => {
  bodyElement.classList.toggle("light-theme");
  if(bodyElement.classList.contains("light-theme")) {
    localStorage.setItem("currentTheme", "themeActive");
  } else {
    localStorage.removeItem("currentTheme");
  }
});

const validMail = (address) => {
  return String(address)
    .toLowerCase()
    .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
};

const contactForm = document.getElementById("contact-form");
const nameInput = document.getElementById("contact-name");
const emailInput = document.getElementById("contact-mail");
const subjectInput = document.getElementById("contact-subject");
const messageInput = document.getElementById("contact-message");
const errorSections = document.querySelector(".errorSection");
contactForm.addEventListener("submit", (e) => {
  let error = [];
  e.preventDefault();
  if (nameInput.value.length <= 5) {
    error.push("Please provide a Name of 5 characters or more");
  }
  if (!validMail(emailInput.value)) {
    error.push("Please provide an valid e-mail address");
  }
  if (subjectInput.value.length <= 5) {
    error.push("Please provide an Subject of 15 characters or more");
  }
  if (messageInput.value.length <= 24) {
    error.push("Your message must be more then 20 characters, and less then 100 characters");
  }

  if (error.length < 1) {
    window.location.href = "index.html";
  } else {
    let infoElem = "";
    error.forEach(err => {
      infoElem += `<p class="error">${err}</p>`;
    });
    errorSections.innerHTML = infoElem;
  }
});

const addDetailsToPage = (result) => {
  const detailElement = document.querySelector("#blog-post-container");

  let detailsObj = `
  <div class="blog-post-data">
      <h1 class="title blog-post-title">
        ${result.title.rendered}
      </h1>
      <div class="post-data">
        <span>${result.date}</span>
      </div>
      <img src="${result._links["wp:featuredmedia"][0].href}" alt="" class="">
    </div>
    <div class="container">
      <p>
        ${result.content.rendered}
      </p>
      <div class="author d-grid">
        <div class="author-about">
          <h3 class="author-name">
            Kjell-Arne Neshagen
          </h3>
          <p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident</p>
          <ul class="list social-media">
            <li class="list-item">
              <a href="#" class="list-link">
                <i class="ri-instagram-line"></i>
              </a>
              <a href="#" class="list-link">
                <i class="ri-facebook-circle-line"></i>
              </a>
            </li>
        </div>
      </div>
    </div>
  `;
  detailElement.innerHTML = detailsObj;
}

const fetchAll = () => {
  const results = [];
  fetch("https://cms.neshagen.no/wp-json/wp/v2/posts")
    .then(data => data.json())
    .then(res => {
      res.forEach((row) => {
        results.push(row);
      });
      addAllDataToPage(results);
    })
    .catch(err => {
      console.warn(err);
      document.querySelector("#blog-post-container").innerHTML = err;
    });
}

const fetchDetails = (param) => {
  fetch(`https://cms.neshagen.no/wp-json/wp/v2/posts/${param}`)
    .then(data => data.json())
    .then(res => {
      console.log(res);

      addDetailsToPage(res);
    })
    .catch(err => {
      console.warn(err);
      document.querySelector(".blog-post-container").innerHTML = err;
    });
}
