const theme_toggle = document.getElementById("themeToggle");

const searchInput = document.getElementById("searchInput");
const regionFilter = document.getElementById("regionFilter");

const countries_container = document.getElementById("countriesContainer");
const CountryModal = document.getElementById("CountryModal");

const loader = document.getElementById("loading");
const loader_spinner = document.getElementById("spinner");

const scrollupBtn = document.getElementById("scrollup");

const countryModal = document.getElementById("CountryModal");
const mainElem = document.getElementById("main");

const backBtn = document.getElementById("back");

const year = document.getElementById("year");
year.textContent = `${new Date().getFullYear()}`;

backBtn.addEventListener("click", () => {
  setTimeout(() => {
    countryModal.classList.add("hidden");
  }, 500);

  mainElem.style = "height: 100%; overflow: unset;";
  if (!countries_container.contains(loader)) {
    countries_container.prepend(loader);
    loader.style = "top: 0;"
  }
  localStorage.setItem("clicked", false);
});

scrollupBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

theme_toggle.addEventListener("click", () => {
  document.body.classList.toggle("darktheme");
  theme_toggle.innerHTML = `<i class="fa-solid fa-moon"></i>`;
  if (document.body.classList.contains("darktheme")) {
    localStorage.setItem("theme", "dark");
    theme_toggle.innerHTML = `<i class="fa-solid fa-moon"></i>`;
  } else {
    localStorage.setItem("theme", "light");
    theme_toggle.innerHTML = `<i class="fa-solid fa-sun"></i>`;
  }
});
function clearCountriesButKeepLoader() {
  const children = Array.from(countries_container.children);

  children.forEach((child) => {
    if (child.id !== "loading") {
      child.remove();
    }
  });
}

//9010825128
let apiUrl =
  "https://restcountries.com/v3.1/all?fields=name,flags,population,region,capital,cca3";

function countryCardMaker(
  cca3,
  country_name,
  population,
  region,
  capital,
  imageUrl
) {
  const div = document.createElement("div");
  div.setAttribute("data-code", `${cca3}`);
  const show_more_btn = document.createElement("button");
  show_more_btn.setAttribute("id", "showmore");
  show_more_btn.textContent = `Know More`;

  const span1 = document.createElement("span");
  const flagimg = document.createElement("img");
  const span2 = document.createElement("span");
  const ul = document.createElement("ul");
  const h2 = document.createElement("h2");

  h2.textContent = country_name;

  span2.prepend(h2);

  const arr = [];
  for (let i = 0; i < 3; i++) {
    var el = document.createElement("li");
    var b = document.createElement("b");
    var p = document.createElement("p");

    el.append(b, p);
    arr.push(el);
    ul.append(el);
  }

  arr[0].children[0].textContent = "Population:";
  arr[1].children[0].textContent = "Region:";
  arr[2].children[0].textContent = "Capital:";
  arr[0].children[1].textContent = population;
  arr[1].children[1].textContent = region;
  arr[2].children[1].textContent = capital;

  flagimg.setAttribute("src", imageUrl);

  span2.append(ul);
  span1.append(flagimg);
  div.append(span1, span2, show_more_btn);
  countries_container.append(div);

  show_more_btn.addEventListener("click", async () => {
    countryModal.classList.remove("hidden");
    const elem = show_more_btn.parentElement;
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
    localStorage.setItem("clicked", true);
    mainElem.style = "height: 100vh; overflow: hidden;";

    if (countries_container.contains(loader)) {
      loader.remove();
      
      countryModal.prepend(loader);
      loader.style = "margin-top: 8rem;"
    }

    const code = elem.getAttribute("data-code");

    fetchCountryByCode(code);
  });
}

loader.classList.add("show");
async function getCountry() {
  try {
    loader.classList.add("show");
    clearCountriesButKeepLoader();
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error("Something went wrong  please try again");
    }

    const data = await response.json();

    data.forEach((country) => {
      countryCardMaker(
        country.cca3,
        country.name.common,
        country.population,
        country.region,
        country.capital?.[0] || "No capital",
        country.flags.svg
      );
    });
  } catch (error) {
    console.log(error);
  } finally {
    setTimeout(() => {
      loader.classList.remove("show");
    }, 300);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  getCountry();
  let THEME = localStorage.getItem("theme");
  if (THEME === "dark") {
    document.body.classList.add("darktheme");
    theme_toggle.innerHTML = `<i class="fa-solid fa-moon"></i>`;
  } else if (THEME === "light") {
    document.body.classList.remove("darktheme");
    theme_toggle.innerHTML = `<i class="fa-solid fa-sun"></i>`;
  }
});

regionFilter.addEventListener("input", async () => {
  if (regionFilter.value === "all") {
    apiUrl = `https://restcountries.com/v3.1/all?fields=name,flags,population,region,capital,cca3`;
  } else {
    apiUrl = `https://restcountries.com/v3.1/region/${regionFilter.value}`;
  }

  requestAnimationFrame(() => {
    getCountry();
  });
});

async function searchCountry(name) {
  try {
    loader.classList.add("show");
    clearCountriesButKeepLoader();
    const url = `https://restcountries.com/v3.1/name/${name}`;
    const requestResponse = await fetch(url);
    if (!requestResponse.ok) {
      if (requestResponse.status == 404) {
        showNoResultMessage(name);
        return;
      }
      throw new Error("Failed to fetch data");
    }

    const data = await requestResponse.json();

    data.forEach((country) => {
      countryCardMaker(
        country.cca3,
        country.name.common,
        country.population,
        country.region,
        country.capital?.[0] || "No capital",
        country.flags.svg
      );
    });
  } catch (err) {
    console.log(err);
  } finally {
    setTimeout(() => loader.classList.remove("show"), 300);
  }
}

function showNoResultMessage(query) {
  loader.classList.remove("show");
  const msg = document.createElement("h2");
  msg.className = "no-result";
  msg.textContent = `❌ No country found for "${query}"`;
  clearCountriesButKeepLoader();
  countries_container.append(msg);
}



searchInput.addEventListener("change", (e) => {
  
 
  const value = searchInput.value.trim();
  setTimeout(() => {
    if (value === "") {
    clearCountriesButKeepLoader();
    apiUrl =
      "https://restcountries.com/v3.1/all?fields=name,flags,population,region,capital";
    getCountry();
    return;
  }
  searchCountry(value);
  },1000);
  
});
searchInput.addEventListener('input',(e)=>{

  const value = searchInput.value;
  if(value === ""){
    clearCountriesButKeepLoader();
    apiUrl =
      "https://restcountries.com/v3.1/all?fields=name,flags,population,region,capital";
    getCountry();
    return;
  }
})

const country_image = document.getElementById("imageshow");
const country_native_name = document.getElementById("native");
const country_population = document.getElementById("popul");
const country_region = document.getElementById("regio");
const country_subRegion = document.getElementById("subregio");
const country_capital = document.getElementById("capit");
const country_area = document.getElementById("area");
const country_currencies = document.getElementById("curren");
const country_lang = document.getElementById("lang");
const border_countries = document.getElementById("second");
const country_Name = document.getElementById("countryName");
const country_borders = document.getElementById("second");
const country_coate_of_arms = document.getElementById("coatOfArms");
const country_google_maps = document.getElementById("google");
const country_openStreet_maps = document.getElementById("openStreet");




async function fetchCountryByCode(code) {
  try {
    loader.style = "height: 100%;";
    loader.classList.add("show");
    const res = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);

    if (!res.ok) throw new Error("Country not found");

    const data = (await res.json())[0];
    function loadImage(imgElement, src) {
      return new Promise((resolve, reject) => {
        if (!src) {
          resolve();
          return;
        }

        imgElement.onload = () => resolve();
        imgElement.onerror = () => reject("Image failed to load");
        imgElement.src = src;
      });
    }

    // display result
    country_image.setAttribute("src", data.flags?.svg || data.flags?.png);
    country_population.textContent = data.population;
    country_region.textContent = data.region;
    country_subRegion.textContent = data.subregion;
    country_capital.textContent = data.capital?.[0] || "NO Capital";
    country_area.textContent = data.area;
    country_Name.innerHTML = `<i class="fa-solid fa-feather"></i></i>  ${data.name.common}`;

    
    //for Countries court of Arms images>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>;
    
    const coatSrc = data.coatOfArms?.svg || data.coatOfArms?.png || "";

    await loadImage(country_coate_of_arms, coatSrc);

    
    country_google_maps.href = data.maps?.googleMaps || "#";
    country_openStreet_maps.href = data.maps?.openStreetMaps || "#";
    // for Native name of Countries
    var natviNameArray = [];
    for (let n of Object.values(data.name.nativeName)) {
      natviNameArray.push(n.official);
    }
    country_native_name.textContent = natviNameArray.join(", ");
    //for Languages of Countries>>>>>>>>>>>>>>>>
    const languagesOf_country = [];

    for (let l of Object.values(data.languages)) {
      languagesOf_country.push(l);
    }

    country_lang.textContent = languagesOf_country.join(", ");

    //for  Border Countries >>>>>>>>>>>>>>>>>>>>>>
    const lengthOf_border_countries = data.borders
      ? data.borders.length
      : "No border countries";
    if (lengthOf_border_countries === "No border countries") {
      country_borders.innerHTML = lengthOf_border_countries;
    }
    
    let borderElementArray = [];
    if (Number.isInteger(lengthOf_border_countries)) {
      for (let licount = 0; licount < lengthOf_border_countries; licount++) {
        var li = document.createElement("li");
        borderElementArray.push(li);
      }
      let borderElementValue = [];
      for (let b of data.borders) {
        
        borderElementValue.push(b);
      }
      for (
        let bordeFinal = 0;
        bordeFinal < lengthOf_border_countries;
        bordeFinal++
      ) {
        borderElementArray[bordeFinal].innerHTML =
          borderElementValue[bordeFinal];
      }
      country_borders.innerHTML = "";
      for (let liElement of borderElementArray) {
        country_borders.append(liElement);
      }
      const allBordersCountries = country_borders.children;
      for (alloneborder of allBordersCountries) {
        alloneborder.addEventListener("click", (e) => {
          setTimeout(()=>{
            countryModal.classList.remove("hidden");
          
          window.scrollTo({
            top: 0,
            behavior: "instant",
          });
          localStorage.setItem("clicked", true);
          mainElem.style = "height: 100vh; overflow: hidden;";

          if (countries_container.contains(loader)) {
            loader.remove();
            countryModal.prepend(loader);
            loader.style = "top: 4.2rem !important;";
          }

          const code = e.target.innerHTML;

          fetchCountryByCode(code);
          },500)
          
        });
      }
    }
    if (country_borders.innerHTML === "") {
      country_borders.textContent = lengthOf_border_countries;
    }
    //for Country Currencies

    let countryHas_currencies = data.currencies ? true : "No currency";
    if (countryHas_currencies) {
      var carray = [];
      for (let c of Object.values(data.currencies)) {
        carray.push(c.name);
      }
      country_currencies.textContent = carray.join(", ");
    } else {
      country_currencies.textContent = countryHas_currencies;
    }
  } catch (error) {
    console.error(error);
  } finally {
    setTimeout(() => {
      loader.classList.remove("show");
    }, 200);
  }
}
