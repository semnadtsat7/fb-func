const app = Vue.createApp({
  data() {
    return {
      schools: [],
      searchName: "",
    };
  },
  mounted() {
    const getAllSchools = firebase.functions().httpsCallable("getAllSchoolsF");

    getAllSchools()
      .then((result) => {
        // Handle the response from the Cloud Function
        const schools = result.data;
        this.schools = schools;
        console.log(schools);
      });
  },
  methods: {
    searchSchools() {
      const searchValue = this.searchName.toLowerCase();
      const filteredSchools = this.schools.filter((school) => {
        const schoolName =
          `${school.name.thai} ${school.name.english}`.toLowerCase();
        return schoolName.includes(searchValue);
      });
      this.schools = filteredSchools;
    },
  },
});

const vueApp = app.mount("#app");

//submit serchform --> แล้วใช้ฟังชันเสริจหาชื่อ
document.getElementById("searchForm").addEventListener("submit", function (e) {
  e.preventDefault();
  vueApp.searchName = document.getElementById("nameInput").value;
  vueApp.searchSchools();
  document.getElementById("searchForm").reset();
  document.getElementById("searchForm").classList.remove("active"); // serch เสดแล้ว serchform หาย
});

document.querySelector(".search").addEventListener("click", function () {
  document.getElementById("searchForm").classList.toggle("active");
});
