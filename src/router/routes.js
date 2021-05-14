import Login from "../views/login/Login.vue";
import MainLayout from "../components/MainLayout.vue";
import Home from "../views/home/Home.vue";
import Words from "../views/words/Words.vue"
import UnLoginHome from "../views/home/UnLoginHome"

const routes = [
  {
    path: "/login",
    component: Login
  },
  {
    path: "/home",
    component: Home
  },,
  {
    path: "/main",
    component: UnLoginHome
  },
  {
    path:"/words",
    component: Words,
    meta:{
      name: 'Words',
      fileId:undefined
    }
  },
  {
    path: "/",
    component: MainLayout,
    redirect: "/main",
    children: [
      {
        path: "/main",
        component: UnLoginHome,
        meta: {
          //other route meta...
          name: 'UnLoginHome'
       }
      }
    ]
  }
];

export default routes;
