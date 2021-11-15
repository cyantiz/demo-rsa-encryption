<template>
    <form id="decrypt" @submit.prevent="decrypt">
        <div class="container">
            <div class="ciphertext">
                <h3 class="ciphertext-title title">Ciphertext:</h3>
                <input
                    class="ciphertext-area"
                    v-model="cipherText"
                    placeholder="Enter ciphertext here"
                    required
                />
            </div>
            <div class="private-key">
                <h3 class="private-key-title title">Private Key:</h3>
                <div class="private-key-subtitle sub-title">
                    Private Exponent (d):
                </div>
                <input
                    class="private-key-exponent key-area"
                    v-model="privateExponent"
                    required
                />
                <div class="sub-title">Modulus (n):</div>
                <input
                    class="private-key-modulus key-area"
                    v-model="modulus"
                    required
                />
                <div style="height: 20px"></div>
                
            </div>
        </div>
        <button type="submit" class="genkey-button button">
            Decrypt<BIconArrowRight />
        </button>
        <div class="plaintext" v-if="plainText">
            <h3 class="title">Plaintext:</h3>
            <input disabled v-model="plainText">
        </div>
    </form>
</template>

<script>
import { BIconArrowRight } from "bootstrap-vue";

export default {
    components: { BIconArrowRight },
    data() {
        return {
            cipherText: "",
            plainText: "",
            modulus: "", //n
            privateExponent: "", //d
        };
    },
    methods: {
        decrypt() {
            // convert ciphertext from base64 -> decimal number
            let c = this.base64ToBigInt(this.cipherText.trim());

            // convert key from hex -> decimal number
            let n = BigInt("0x" + this.modulus.trim().split(" ").join(""));
            let d = BigInt("0x" + this.privateExponent.trim().split(" ").join(""));

            // decrypt
            let m = this.modPrimePow(c, d, n);

            // convert m (number) -> M (text) to show
            m = m.toString(16);
            if(m.length % 2 != 0) c = "0" + c;
            this.plainText = this.UTF8ArrayToString(m.match(/.{1,2}/g));
        },
        UTF8ArrayToString(arr) {
            arr = arr.map(x => parseInt(x, 16))
            var encodedString = String.fromCharCode.apply(null, arr),
                decodedString = decodeURIComponent(escape(encodedString));
            return decodedString;
        },
        base64ToBigInt(b64) {
            var bin = atob(b64);
            var hex = [];

            bin.split("").forEach(function (ch) {
                var h = ch.charCodeAt(0).toString(16);
                if (h.length % 2) {
                    h = "0" + h;
                }
                hex.push(h);
            });

            return BigInt("0x" + hex.join(""));
        },
        modPrimePow(a, b, p) {
            let res = BigInt(1);
            a = a % p;
            b = b % (p - BigInt(1));
            while (b > 0) {
                if (b % BigInt(2) > BigInt(0)) res = (res * a) % p;
                a = (a * a) % p;
                b = b / BigInt(2);
            }
            return res;
        },
    },
};
</script>

<style lang="less" scoped>
#decrypt {
    padding: 20px;
    text-align: center;
}

.container {
    width: 900px;
    margin: auto;
    text-align: center;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;

    .private-key,
    .ciphertext {
        margin-bottom: 10px;

        .title {
            margin: 10px 0;
            font-weight: 800;
            text-align: left;
        }
        .sub-title {
            text-align: left;
            margin-top: 10px;
        }
        .key-area,
        .ciphertext-area {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 30px;
            padding: 10px;
            border: 1px solid black;
            border-radius: 2px;
            font-family: "consolas", sans-serif;
            font-size: 13px;
            word-wrap: break-word;
            word-break: break-all;
        }
    }
}
.plaintext {
    width: calc(900px - 30px);
    margin: auto;
    text-align: center;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    .title {
            margin: 10px 0;
            font-weight: 800;
            text-align: left;
        }
        .sub-title {
            text-align: left;
            margin-top: 10px;
        }
        input {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 30px;
            padding: 10px;
            border: 1px solid black;
            background: white;
            color: black;
            border-radius: 2px;
            font-family: "consolas", sans-serif;
            font-size: 13px;
            word-wrap: break-word;
            word-break: break-all;
        }
}
</style>