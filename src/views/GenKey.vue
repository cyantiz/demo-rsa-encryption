<template>
    <div id="gen-key">
        <MessageModal
            v-if="activeModal"
            @close-modal="activeModal = false"
            modal-msg="Your text has been copied to clipboard"
        />
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
                    <div class="copy-button" @click="copy(publicExponent)"><BIconClipboardPlus/></div>
                    {{ publicExponent }}
                </div>
                <div class="sub-title">Modulus (n):</div>
                <div class="public-key-modulus key-area">
                    <div class="copy-button" @click="copy(modulus)"><BIconClipboardPlus/></div>
                    {{ modulus }}
                </div>
            </div>
            <div class="private-key">
                <h3 class="private-key-title title">Private Key:</h3>
                <div class="private-key-subtitle sub-title">
                    Private Exponent (d):
                </div>
                <div class="private-key-exponent key-area">
                    <div class="copy-button" @click="copy(privateExponent)"><BIconClipboardPlus/></div>
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
import { BIconArrowRight, BIconClipboardPlus } from "bootstrap-vue";
import MessageModal from "@/components/MessageModal.vue";
var forge = require("node-forge");

export default {
    components: { BIconArrowRight, BIconClipboardPlus, MessageModal },
    data() {
        return {
            activeModal: false,
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
            
            // calc n and euler's totient phi(n)
            let n = p * q;
            let phi = (p - BigInt(1)) * (q - BigInt(1));

            // calc e and d
            let e = BigInt(65537);
            let d = this.modInverse(e, phi);

            // convert key to hex
            this.modulus = this.converToHex(n);
            this.privateExponent = this.converToHex(d);
            this.publicExponent = e.toString();
            this.printProgress(p, q, n, phi, e, d);
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
            if (a != BigInt(1)) {
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
            console.clear();
            console.log("%c📜START GENERATING KEY", 'color: pink; background: black; font-size: 20px; font-weight: bold')
            console.log("%c⏳GENERATE RANDOM P and Q",'color: pink; background: black; font-size: 14px; font-weight: bold')
            console.log("%c🌍p " + p.toString(2).length, 'font-size: 13px;')
            console.log(p.toString())
            console.log("%c🌍q " + q.toString(2).length, 'font-size: 13px;')
            console.log(q.toString())
            console.log("%c⏳CALC N and PHI(N)", 'color: pink; background: black; font-size: 14px; font-weight: bold')
            console.log("%c🌍n " + n.toString(2).length, 'font-size: 13px;')
            console.log(n.toString())
            console.log("%c🌍phi(n) " + phi.toString(2).length, 'font-size: 13px;')
            console.log(phi.toString())
            console.log("%c⏳CALC E and D", 'color: pink; background: black; font-size: 14px; font-weight: bold')
            console.log("%c🌍e " + e.toString(2).length, 'font-size: 13px;')
            console.log(e.toString())
            console.log("%c🌍d " + d.toString(2).length, 'font-size: 13px;')
            console.log(d.toString())
            console.log("%c👌GENERATING KEY SUCCESS",'color: pink; background: black; font-size: 20px; font-weight: bold')
        },
        converToHex(num) {
            num = num.toString(16);
            while (num.length < 512) num = "0" + num;
            return num
                .toUpperCase()
                .match(/.{1,2}/g)
                .join(" ");
        },
        copy(text) {
            let dummy = document.createElement("textarea");
            document.body.appendChild(dummy);
            dummy.value = text;
            dummy.select();
            document.execCommand("copy");
            document.body.removeChild(dummy);
            this.activeModal = true;
        }   
    },
};
</script>

<style lang="less" scoped>
#gen-key {
    padding: 10px;
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
            height: 30px;
            padding: 20px;
            border: 1px solid black;
            border-radius: 2px;
            font-size: 13px;
            text-align: left;
            font-family: "consolas", sans-serif;
            word-wrap: break-word;
            word-break: break-all;
            position: relative;
            &:hover {
                .copy-button {
                    opacity: 1;
                }
            }
            .copy-button {
                opacity: 0;
                position: absolute;
                right: 5px;
                top: 4px;
                font-size: 15px;
                cursor: pointer;
                transition: all ease .2s;
                &:hover {
                    color: rgba(0,0,0,0.5);
                }
            }
        }
        .key-area.public-key-exponent {
            padding: 15px;
        }
        .key-area.public-key-modulus,
        .key-area.private-key-exponent {
            height: 178px;
            overflow-y: auto;
        }
    }
    .public-key .public-key-title {
        margin-top: 0px;
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