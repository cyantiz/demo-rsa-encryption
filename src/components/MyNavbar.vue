<template>
    <div id="nav">
        <router-link :to="{ name: 'GenKey' }">Generate key</router-link>
        <router-link :to="{ name: 'Encrypt' }">Encrypt</router-link>
        <router-link :to="{ name: 'Decrypt' }">Decrypt</router-link>
    </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
#nav {
    display: flex;
    justify-content: center;
    align-items: center;
    background: #3c3c3c;
}

#nav a {
    padding: 10px 20px;
    text-decoration: none;
    color: white;
    &:hover {
        background: #111111;
    }
}
#nav a.router-link-exact-active {
    background: white;
    color: black;
}
</style>