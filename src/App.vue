<template>
    <div id="app">
        <MyNavbar />
        <keep-alive>
            <router-view />
        </keep-alive>
    </div>
</template>

<script>
import MyNavbar from "@/components/MyNavbar.vue";

export default {
    components: { MyNavbar },
};
</script>

<style lang="less">
@import (css)
    url("https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap");

* {
    box-sizing: border-box;
    font-family: "Montserrat", sans-serif;
}

body {
    margin: 0;
    padding: 0;
}

input {
    font-family: "Source Code Pro", "Consolas", monospace;
}

.button {
    padding: 10px 25px;
    margin: 20px auto 0px auto;
    display: inline-block;
    background: rgba(0, 123, 255, 1);
    color: white;
    cursor: pointer;
    border-radius: 2px;
    transition: all ease 0.2s;
    border: none;
    user-select: none;

    .b-icon {
        transform: translateX(5px);
        transition: inherit;
    }
    &:hover {
        background: rgba(0, 123, 255, 0.8);
        .b-icon {
            transform: translateX(10px);
        }
    }
}
</style>
