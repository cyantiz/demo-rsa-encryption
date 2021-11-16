<template>
    <form id="encrypt" @submit.prevent="encrypt">
        <ErrorModal v-if="error" @close-modal="error = false" />
        <div class="container">
            <div class="plaintext">
                <h3 class="plaintext-title title">Plaintext:</h3>
                <input
                    class="plaintext-area"
                    v-model="plainText"
                    placeholder="Enter plaintext here"
                    required
                />
            </div>
            <div class="public-key">
                <h3 class="public-key-title title">Public Key:</h3>
                <div class="public-key-subtitle sub-title">
                    Public Exponent (e):
                </div>
                <input
                    class="public-key-exponent key-area"
                    v-model="publicExponent"
                    required
                />
                <div class="sub-title">Modulus (n):</div>
                <input
                    class="public-key-modulus key-area"
                    v-model="modulus"
                    required
                />
            </div>
        </div>
        <button type="submit" class="genkey-button button">
            Encrypt<BIconArrowRight />
        </button>
        <input
            class="ciphertext"
            disabled
            v-if="cipherText"
            v-model="cipherText"
        />
    </form>
</template>

<script>
import { BIconArrowRight } from "bootstrap-vue";
import ErrorModal from "@/components/ErrorModal.vue";

export default {
    components: { BIconArrowRight, ErrorModal },
    data() {
        return {
            plainText: "",
            cipherText: "",
            publicExponent: 65537, //e
            modulus: "", //n
            error: false,
        };
    },
    methods: {
        encrypt() {
            this.error = false;
            this.cipherText = "";
            try {
                // convert M (text) -> m (number)
                let m = this.stringToUTF8Array(this.plainText).join("");
                m = BigInt("0x" + m);

                // convert key (hex) -> decimal number
                let n = BigInt("0x" + this.modulus.trim().split(" ").join(""));
                let e = BigInt(this.publicExponent);

                // encrypt
                let c = this.modPrimePow(m, e, n);

                // convert c -> base64 text to show
                this.cipherText = this.bigIntToBase64(c);
            } catch (err) {
                this.error = true;
                return;
            }
        },
        stringToUTF8Array(s) {
            let res = new TextEncoder("utf-8")
                .encode(s)
                .join(" ")
                .split(" ")
                .map((x) => parseInt(x).toString(16));
            return res;
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
        bigIntToBase64(bn) {
            var hex = BigInt(bn).toString(16);
            if (hex.length % 2) {
                hex = "0" + hex;
            }

            var bin = [];
            var i = 0;
            var d;
            var b;
            while (i < hex.length) {
                d = parseInt(hex.slice(i, i + 2), 16);
                b = String.fromCharCode(d);
                bin.push(b);
                i += 2;
            }

            return btoa(bin.join(""));
        },
    },
};
</script>

<style lang="less" scoped>
#encrypt {
    padding: 20px;
    text-align: center;
}

.container {
    width: 900px;
    margin: auto;
    text-align: center;
    display: flex;
    flex-direction: column;

    .public-key,
    .plaintext {
        margin-bottom: 10px;

        .title {
            margin: 15px 0 5px 0;
            font-weight: 800;
            font-size: 20px;
            text-align: left;
        }
        .sub-title {
            text-align: left;
            margin-top: 5px;
        }
        .key-area,
        .plaintext-area {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 40px;
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
.ciphertext {
    display: flex;
    width: calc(900px - 30px);
    @media (max-width: 990px) {
        width: calc(100% - 30px);
    }
    height: 30px;
    margin: 20px auto 0 auto;
    padding: 10px;
    border: 1px solid black;
    border-radius: 2px;
    font-family: "consolas", sans-serif;
    font-size: 13px;
    word-wrap: break-word;
    word-break: break-all;
}
</style>