import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { BACKEND, Strings } from '@/support/Constants';
import { LabelInputBox, TextareaBox } from '../Form/Input';
import { StoreContext } from '@/stores/Store';
import AnimationWrapper from '@/common/page-animation';
import { SentenceContext } from '../comment-field.component';

const RegEmailVerifications = ({ open, data }) => {
    const [openModalPopup, setOpenModalPopup] = useState(open)
    const [resendCooldown, setResendCooldown] = useState(false);
    const [remainingTime, setRemainingTime] = useState(0);

    useEffect(() => {
    }, [openModalPopup, open, data]);

    const handleClose = () => {
        setOpenModalPopup(!openModalPopup);
    };

    const startCooldownTimer = () => {
        setResendCooldown(true);
        setRemainingTime(30);

        const countdownInterval = setInterval(() => {
            setRemainingTime(prevTime => {
                if (prevTime <= 1) {
                    clearInterval(countdownInterval);
                    setResendCooldown(false);
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);
    };

    const resendEmail = async () => {
        if (!data.user.name || resendCooldown) return

        try {
            const response = await fetch(`${BACKEND}/auth/resend-verify-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username: data.user.name })
            });

            startCooldownTimer();
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <>
            {openModalPopup === true &&
                <div class="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-50 py-10 z-[51]">
                    <div class="max-h-full w-full max-w-xl overflow-y-auto sm:rounded-2xl bg-white">
                        <div class="w-full">
                            <div class="m-8 my-20 max-w-[400px] mx-auto">
                                <div class="mb-8">
                                    <h1 class="mb-4 text-3xl font-extrabold">Email Verification</h1>
                                    <p class="text-gray-400">
                                        Thank you for registering! To complete the registration process, please check your email
                                        and click on the verification link we've sent you. Email has been sent to <span class="text-gray-100 mr-3">{data.user.email}</span>
                                    </p>
                                </div>
                                <div class="space-y-4">
                                    <button class="p-3 bg-black rounded-full text-white w-full" onClick={resendEmail}>
                                        {resendCooldown ? `Resend (${remainingTime}s)` : 'Resend'}
                                    </button>
                                    <button class="p-3 bg-white border rounded-full w-full" onClick={handleClose}>
                                        Skip for now
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

const LogEmailNotVerified = ({ open, data }) => {
    const [openModalPopup, setOpenModalPopup] = useState(open)
    const [resendCooldown, setResendCooldown] = useState(false);
    const [remainingTime, setRemainingTime] = useState(0);

    useEffect(() => {
    }, [openModalPopup, open, data]);

    const handleClose = () => {
        setOpenModalPopup(!openModalPopup);
    };

    const startCooldownTimer = () => {
        setResendCooldown(true);
        setRemainingTime(30);

        const countdownInterval = setInterval(() => {
            setRemainingTime(prevTime => {
                if (prevTime <= 1) {
                    clearInterval(countdownInterval);
                    setResendCooldown(false);
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);
    };

    const resendEmail = async () => {
        if (!data.username || resendCooldown) return

        try {
            await fetch(`${BACKEND}/auth/resend-verify-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username: data.username })
            });

            startCooldownTimer();
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <>
            {openModalPopup === true &&
                <div class="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-50 py-10 z-[51]">
                    <div class="max-h-full w-full max-w-xl overflow-y-auto sm:rounded-2xl bg-white">
                        <div class="w-full">
                            <div class="m-8 my-20 max-w-[400px] mx-auto">
                                <div class="mb-8">
                                    <h1 class="mb-4 text-3xl font-extrabold">Email Not Verified</h1>
                                    <p class="text-gray-400">
                                        Your email is not verified. Please check your email and click on the verification link we've sent you.
                                        Email has been sent to <span class="text-gray-100 mr-3">{data.email}</span>
                                    </p>
                                </div>
                                <div class="space-y-4">
                                    <button class="p-3 bg-black rounded-full text-white w-full" onClick={resendEmail}>
                                        {resendCooldown ? `Resend (${remainingTime}s)` : 'Resend'}
                                    </button>
                                    <button class="p-3 bg-white border rounded-full w-full" onClick={handleClose}>
                                        Skip for now
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

const Terms = ({ open }) => {
    const [openModalPopup, setOpenModalPopup] = useState(open)

    useEffect(() => {
    }, [openModalPopup, open]);

    const handleClose = () => {
        setOpenModalPopup(!openModalPopup);
    };

    return (
        <>
            {openModalPopup === true &&
                <div class="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-50 py-10 z-[51]">
                    <div class="max-h-full w-full max-w-xl overflow-y-auto sm:rounded-2xl bg-white">
                        <div class="w-full">
                            <div class="m-8 my-20 max-w-[400px] mx-auto">
                                <div class="mb-8">
                                    <h1 class="mb-4 text-3xl font-extrabold">TERMS AND CONDITIONS OF WEBSITE USE</h1>
                                    <p class="text-gray-400">
                                        Login and Usage
                                        By logging into the website 2coffee.dev, you understand and must comply with the following provisions as well as statements regarding rights, obligations, and fundamental responsibilities related to accessing and using the information presented on the 2coffee.dev page.

                                        We refer to DEVELOPERS or specific entities mentioned in this document.

                                        Copyright
                                        We retain all rights, rights to protect and use any information (in any form) published or introduced on the Website (unless otherwise indicated or information is introduced, understood to be the property of another party) at all times. We do not intend to allow copying, publishing, reproduction, rental, sale, commercial distribution, or personal use without our written consent.

                                        Information and Use of Information on the Web
                                        Information on this website (including but not limited to terms and conditions, explanations, instructions, links, images, downloadable resources, any pure information, and original information introduced by us on the Website) may be changed and updated at our sole discretion. The information introduced on the Website is provided in its original form at the time of publication and introduction. Depending on the context and purpose of use, we do not guarantee the suitability or accuracy of the information provided on the Website at any time when such information has not been explained and officially advised by our authorized personnel.

                                        Nothing in this document binds the parties to a formal offer, offer of official transactions by one party or both parties unless information introduced on the website specifies how an offer or transaction is made and completed for a specific purpose.

                                        Any content introduced on the website is not directed at a specific entity but is intended to serve customers interested and in need in our industry, depending on the extent of transactions conducted in the introduced territory or where we operate.

                                        Intellectual Property Rights
                                        Any intellectual property materials including but not limited to content, logos, brands, instructions, trademarks introduced on the Website are the intellectual property of us (except for information provided to us as per our instructions through the Website), partner vendors, our service providers. We and our partners retain rights under the law to use and not transfer in any form except legal permission.

                                        Limitation of Liability
                                        We are not responsible for any damage, loss, risk arising from the exploitation of information on the website that has not been investigated, accurately verified by legal means permitted by and regulated by these terms and conditions; damages caused by information on the Website, the transmission of information on the Website being interrupted, restricted, resource information, websites being damaged by viruses, data theft, force majeure events. Any damage caused to users who log in, use information on the Website, caused by errors, whether intentional or accidental, is not our fault, including employees, management, leadership, agents, subsidiaries, affiliates, partners of us whether intentional or negligent; damages due to the use of information for purposes that are not appropriate, violations of the Law or infringement, disregard for harmful warnings, infringement of the rights of related parties.

                                        Privacy Policy
                                        Customer information sent, transmitted, transferred through the channels introduced on the Website will be kept confidential according to the appropriate privacy policy as required by laws on information, related electronic data.

                                        Product and Service Policies and Terms
                                        The policies, terms and conditions of transactions related to products, services provided by us to our customers are introduced on the Website and are an integral part of this document. You must read the instructions, policies, regulations, terms and conditions before purchasing our products, services introduced on the Website. Your completion of a purchase process for any product, service through this Website is understood as you are aware, understand, and commit to fully implement any or all aspects of the policies, terms, and conditions of the purchase of that product, service.
                                    </p>
                                </div>
                                <div class="space-y-4">
                                    <button class="p-3 bg-black rounded-full text-white w-full">
                                        OK
                                    </button>
                                    <button class="p-3 bg-white border rounded-full w-full" onClick={handleClose}>
                                        Skip for now
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

const AIWriter = ({ open, close }) => {
    const { lang } = useContext(StoreContext)
    const { setStc } = useContext(SentenceContext)
    const modalRef = useRef();
    const [sentence, setSentence] = useState('');
    const [isRewriting, setIsRewriting] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const fullLang = lang === "vi" ? "Vietnamese" : "English"

    const handleRewrite = async () => {
        if (isRewriting) return;

        setIsRewriting(true);
        setCooldown(10);

        try {
            const response = await fetch('https://typli.ai/api/completion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ prompt: `You are Typli, an AI Sentence Rewriter. You provide creative and unique wordsmithing to rewrite sentences in a more understandable and readable way but keeping the original meaning of the sentence.\n Rewrite this sentence but keep the same meaning and change this to ${fullLang}:\n\n ${sentence}`, temperature: 1.2 })
            });
            const data = await response.text();
            if (data) {
                setSentence(data);
            }
        } catch (err) {
            console.error('Error:', err);
        } finally {
            setIsRewriting(false);
            startCooldown();
        }
    };

    const startCooldown = () => {
        const intervalId = setInterval(() => {
            setCooldown(prevCooldown => {
                if (prevCooldown === 0) {
                    clearInterval(intervalId);
                }
                return prevCooldown - 1;
            });
        }, 1000);
    };

    const handleApply = () => {
        setStc(sentence)
        setSentence("")
        close()
    }

    useEffect(() => {
    }, [open]);

    useEffect(() => {
        if (open === true) {
            document.body.classList.add('noscroll')
        } else {
            document.body.classList.remove('noscroll')
        }
    }, [open])

    useEffect(() => {
        const handleScrollAndClickOutside = (event) => {
            if (open && modalRef.current && !modalRef.current.contains(event.target)) {
                close();
                console.log("Clicked outside modal");
            }
        };

        document.addEventListener('click', handleScrollAndClickOutside, true);

        return () => {
            document.removeEventListener('click', handleScrollAndClickOutside, true);
        };
    }, [open, close]);

    return (
        <AnimationWrapper>
            {open === true &&
                <div class="font-sans bg-gray flex items-center justify-center h-screen">
                    <div class="fixed z-10 inset-0 flex items-center justify-center">
                        <div class="absolute inset-0 bg-gray-500 opacity-75" />
                        <div class="relative bg-white rounded-lg overflow-hidden shadow-xl max-w-screen-md w-full m-4 max-sm:h-full max-sm:m-0" ref={modalRef}>
                            <div class="flex items-center justify-between px-6 py-4">
                                <h3 class="text-lg leading-6 font-medium text-black">
                                    {Strings.aiWriterTitle[lang]}
                                </h3>
                                <button class="flex justify-center items-center w-12 h-12 rounded-full bg-grey" onClick={() => close()}>
                                    <i class="fi fi-rr-cross text-2xl mt-1"></i>
                                </button>
                            </div>
                            <div class="prose p-6 overflow-y-auto max-h-[35rem] border border-dark-grey/10 shadow-md max-sm:max-h-[40rem]">
                                <p class="text-lg font-bold mb-4">{Strings.aiWriterSubtitle[lang]}</p>
                                <p>{Strings.instructions[lang]}</p>
                                <p>{Strings.aiWriterStep1[lang]}</p>
                                <p>{Strings.aiWriterStep2[lang]}</p>
                                <p>{Strings.aiWriterStep3[lang]}</p>
                                <LabelInputBox text={Strings.sentenceRewrite[lang]} />
                                <TextareaBox value={sentence} onChange={(e) => setSentence(e.target.value)} />
                                <button onClick={handleRewrite} type="button" disabled={isRewriting || cooldown > 0} className={`inline-flex justify-center rounded-md border border-transparent shadow-sm my-5 px-4 py-2 bg-black text-base text-white sm:w-auto sm:text-sm ${isRewriting || cooldown > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                    {isRewriting ? Strings.rewriting[lang] : cooldown > 0 ? `${Strings.pleaseWait[lang]} ${cooldown}s` : Strings.rewrite[lang]}
                                </button>
                            </div>
                            <div class="bg-white px-4 py-3 sm:px-6 flex align-items justify-end p-4 gap-4 flex-row">
                                <button onClick={() => handleApply()} type="button" class="btn-dark px-10">{Strings.apply[lang]}</button>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </AnimationWrapper>
    )
}

const DeletePopup = ({ open, close, onConfirmed, title, body, lang }) => {

    return (
        <AnimationWrapper>
            {open === true &&
                <div class="font-sans bg-gray flex items-center justify-center h-screen">
                    <div class="fixed z-[99] inset-0 flex items-center justify-center">
                        <div class="absolute inset-0 bg-gray-500 opacity-75" />
                        <div class="relative bg-white rounded-lg overflow-hidden shadow-xl max-w-screen-md w-full m-4 max-sm:h-full max-sm:m-0">
                            <div class="flex items-center justify-between px-6 py-4">
                                <h3 class="text-lg leading-6 font-medium text-black">
                                    {title}
                                </h3>
                                <button class="flex justify-center items-center w-12 h-12 rounded-full bg-grey" onClick={() => close()}>
                                    <i class="fi fi-rr-cross text-2xl mt-1"></i>
                                </button>
                            </div>
                            <div class="prose p-6 overflow-y-auto max-h-[35rem] border border-dark-grey/10 shadow-md max-sm:max-h-[40rem]">
                                {body}
                            </div>
                            <div class="bg-white px-4 py-3 sm:px-6 flex align-items justify-end p-4 gap-4 flex-row">
                                <button onClick={onConfirmed} type="button" class="btn-dark px-7">Confirm</button>
                                <button onClick={() => close()} type="button" class="btn-light px-7">{Strings.cancel[lang]}</button>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </AnimationWrapper>
    )
}

export { RegEmailVerifications, LogEmailNotVerified, Terms, AIWriter, DeletePopup }