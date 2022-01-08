<template>
    <div class="message-modal">
            <div class="modal-box">
                <p>{{modalMsg}}</p>
                <div class="modal-button" @click="$emit('close-modal')">OK</div>
            </div>   
    </div>
</template>

<script>

export default {
    props: ['modalMsg'],
    data() {
        return {}
    },
}
</script>

<style lang="less" scoped>
.message-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 200;
    background: rgba(0,0,0,0.5);
    .modal-box {
        background: white;
        padding: 20px 30px;
        border-radius: 10px;
        p {
            margin-bottom: 3px;
            font-size: 14px;
        }
    }
    .modal-button {
        margin-top: 10px;
        display: inline-block;
        background: #2c2c2c;
        padding: 8px 20px;
        cursor: pointer;
        color: white;
        border-radius: 30px;
        font-size: 14px;
        user-select: none;
    }
}
</style>