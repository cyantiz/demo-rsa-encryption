<template>
    <div id="gen-key">
        <div class="loading" v-if="loading">
            <div class="title">Key is generating...</div>
            <div class="lds-ellipsis">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
        <div class="key-container">
            <div class="public-key">
                <h3 class="public-key-title title">Public Key:</h3>
                <div class="public-key-subtitle sub-title">
                    Public Exponent (e):
                </div>
                <div class="public-key-exponent key-area">
                    {{ publicExponent }}
                </div>
                <div class="sub-title">Modulus (n):</div>
                <div class="public-key-modulus key-area">
                    {{ modulus }}
                </div>
            </div>
            <div class="private-key">
                <h3 class="private-key-title title">Private Key:</h3>
                <div class="private-key-subtitle sub-title">
                    Private Exponent (d):
                </div>
                <div class="private-key-exponent key-area">
                    {{ privateExponent }}
                </div>
            </div>
        </div>
        <div class="genkey-button button" @click="generateKey">
            Generate Key <BIconArrowRight />
        </div>
    </div>
</template>

<script>
import { BIconArrowRight } from "bootstrap-vue";
var forge = require("node-forge");

export default {
    components: { BIconArrowRight },
    data() {
        return {
            loading: false,
            publicExponent: 65537, // e
            modulus: "", //n
            privateExponent: "", //d
        };
    },
    methods: {
        async generateKey() {
            this.loading = true;
            let bits = 2048;
            // generate prime pair p, q
            let p = BigInt(0),
                q = BigInt(0);
            p = await this.randomPrime(bits / 2);
            q = await this.randomPrime(bits / 2);
            let n = p * q;
            let phi = (p - BigInt(1)) * (q - BigInt(1));

            // calc e and d
            let e = BigInt(65537);
            let d = this.modInverse(e, phi);

            // convert key to hex
            this.modulus = this.converToHex(n);
            this.privateExponent = this.converToHex(d);
            this.publicExponent = e.toString();
            // this.printProgress(p, q, n, phi, e, d);
            this.loading = false;
        },
        async randomPrime(bits) {
            return new Promise((res) => {
                return forge.prime.generateProbablePrime(bits, (err, num) => {
                    res(BigInt(num.toString()));
                });
            });
        },
        modInverse(a, m) {
            // find the gcd
            const s = [];
            let b = m;
            while (b) {
                [a, b] = [b, a % b];
                s.push({ a, b });
            }
            if (a != 1) {
                return NaN; // inverse does not exists
            }
            // find the inverse
            let x = BigInt(1);
            let y = BigInt(0);
            for (let i = s.length - 2; i >= 0; --i) {
                [x, y] = [y, x - y * (s[i].a / s[i].b)];
            }
            return ((y % m) + m) % m;
        },
        printProgress(p, q, n, phi, e, d) {
            console.log("======START GENERATING KEY======");
            console.log("=======GENERATE P and Q========");
            console.log("p\n" + p.toString());
            console.log("q\n" + q.toString());
            console.log("=======CALC N and PHI(N)=======");
            console.log("n\n" + n.toString());
            console.log("phi\n" + phi.toString());
            console.log("=========CALC E and D==========");
            console.log("e\n" + e.toString());
            console.log("d\n" + d.toString());
            console.log("=====FINISH GENERATING KEY=====");
        },
        converToHex(num) {
            num = num.toString(16);
            while (num.length < 512) num = "0" + num;
            return num
                .toUpperCase()
                .match(/.{1,2}/g)
                .join(" ");
        },
    },
};
</script>

<style lang="less" scoped>
#gen-key {
    padding: 20px;
    text-align: center;
}

.key-container {
    @media (max-width: 920px) {
        width: 90%;
    }
    width: 900px;
    margin: auto;
    text-align: center;
    display: flex;
    flex-direction: column;

    .public-key,
    .private-key {
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
        .key-area {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 40px;
            padding: 10px;
            border: 1px solid black;
            border-radius: 2px;
            font-size: 13px;
            text-align: left;
            font-family: "consolas", sans-serif;
            word-wrap: break-word;
            word-break: break-all;
            overflow-y: auto;
        }
        .key-area.public-key-modulus,
        .key-area.private-key-exponent {
            height: 160px;
        }
    }
}

.lds-ellipsis {
    display: inline-block;
    position: relative;
    width: 80px;
    height: 80px;
}
.lds-ellipsis div {
    position: absolute;
    top: 33px;
    width: 13px;
    height: 13px;
    border-radius: 50%;
    background: #fff;
    animation-timing-function: cubic-bezier(0, 1, 1, 0);
}
.lds-ellipsis div:nth-child(1) {
    left: 8px;
    animation: lds-ellipsis1 0.6s infinite;
}
.lds-ellipsis div:nth-child(2) {
    left: 8px;
    animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(3) {
    left: 32px;
    animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(4) {
    left: 56px;
    animation: lds-ellipsis3 0.6s infinite;
}
@keyframes lds-ellipsis1 {
    0% {
        transform: scale(0);
    }
    100% {
        transform: scale(1);
    }
}
@keyframes lds-ellipsis3 {
    0% {
        transform: scale(1);
    }
    100% {
        transform: scale(0);
    }
}
@keyframes lds-ellipsis2 {
    0% {
        transform: translate(0, 0);
    }
    100% {
        transform: translate(24px, 0);
    }
}

.loading {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.8);
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    color: white;
    user-select: none;
    .title {
        margin-bottom: 10px;
        margin-top: -10px;
        font-weight: 300;
        font-size: 25px;
    }
}
</style>