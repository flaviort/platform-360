// libraries
import clsx from 'clsx'

// layouts
import OtherWrapper from '@/layouts/Other'

// utils
import { contact } from '@/utils/routes'
import { email } from '@/utils/functions'

// css
import styles from './index.module.scss'

export default function TermsAndConditions() {
    return (
        <OtherWrapper>
            <main className={styles.page}>
                
                <section className='py-smaller bg-gray-100'>
                    <div className="container">
                        
                        <h1 className='text-65 bold blue'>
                            Terms and Conditions
                        </h1>

                        <p className='mt-half'>
                            Effective Date: July 1, 2024
                        </p>
                        
                    </div>
                </section>

                <section className='pt-small pb-medium'>
                    <div className='container'>
                        <div className={clsx(styles.content, 'rich-text')}>

                            <p>
                                These Terms and Conditions ("Terms") govern your use of the services provided by Platform360° ("we", "our", "us"), a market research company. By accessing or using our services, you agree to comply with and be bound by these Terms. If you do not agree to these Terms, please do not use our services.
                            </p>

                            <h2 className='purple'>
                                1. Services
                            </h2>

                            <p>
                                Platform360° provides market research services, including data analysis, trend reports, competitive analysis, and other related services. Our services are designed to assist businesses in the footwear and apparel industries with strategic planning and market insights.
                            </p>

                            <h2 className='purple'>
                                2. Eligibility
                            </h2>
                            
                            <p>
                                You must be at least 18 years old and have the legal capacity to enter into a binding contract to use our services. By using our services, you represent and warrant that you meet these eligibility requirements.
                            </p>
                            
                            <h2 className='purple'>
                                3. Client Responsibilities
                            </h2>

                            <p>
                                As a client, you agree to:
                            </p>

                            <ul>
                                <li>
                                    Provide accurate and complete information as requested by us.
                                </li>

                                <li>
                                    Use our services in compliance with all applicable laws and regulations.
                                </li>

                                <li>
                                    Refrain from using our services for any unlawful or unauthorized purposes.
                                </li>

                                <li>
                                    Maintain the confidentiality of any login credentials associated with your account.
                                </li>

                            </ul>

                            <h2 className='purple'>
                                4. Payment and Fees
                            </h2>

                            <ul>

                                <li>
                                    <b>Fees:</b> You agree to pay all fees associated with the services you purchase from us. Fees are outlined in the service agreement or invoice provided to you.
                                </li>

                                <li>
                                    <b>Payment Terms:</b> Payments are due as specified in the service agreement or invoice. Late payments may be subject to additional charges.
                                </li>

                                <li>
                                    <b>Refunds:</b> Refunds are provided only as specified in the service agreement or at our discretion.
                                </li>

                            </ul>

                            <h2 className='purple'>
                                5. Confidentiality
                            </h2>
                            
                            <p>
                                We are committed to maintaining the confidentiality of your information. Any data you provide to us will be used solely for the purpose of delivering our services and will not be disclosed to third parties except as necessary to perform our services or as required by law.
                            </p>

                            <h2 className='purple'>
                                6. Intellectual Property
                            </h2>
                            
                            <p>
                                All content, materials, and data provided as part of our services are protected by intellectual property laws. You are granted a limited, non-exclusive, non-transferable license to use these materials solely for your internal business purposes. You may not reproduce, distribute, or create derivative works from our materials without our prior written consent.
                            </p>

                            <h2 className='purple'>
                                7. Data Use and Privacy
                            </h2>
                            
                            <p>
                                Our use of your data is governed by our Privacy Policy, which is incorporated by reference into these Terms. By using our services, you agree to the terms of our Privacy Policy.
                            </p>

                            <h2 className='purple'>
                                8. Disclaimer of Warranties
                            </h2>
                            
                            <p>
                                Our services are provided "as is" and "as available" without any warranties of any kind, either express or implied. We do not warrant that our services will be uninterrupted, error-free, or free from viruses or other harmful components. To the fullest extent permitted by law, we disclaim all warranties, including implied warranties of merchantability, fitness for a particular purpose, and non-infringement.
                            </p>

                            <h2 className='purple'>
                                9. Limitation of Liability
                            </h2>
                            
                            <p>
                                To the maximum extent permitted by law, Platform360° and its affiliates, officers, employees, agents, and partners shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from:
                            </p>

                            <ul>

                                <li>
                                    Your use or inability to use our services.
                                </li>

                                <li>
                                    Any unauthorized access to or use of our servers and/or any personal information stored therein.
                                </li>

                                <li>
                                    Any interruption or cessation of transmission to or from our services.
                                </li>

                                <li>
                                    Any bugs, viruses, trojan horses, or the like that may be transmitted to or through our services by any third party.
                                </li>

                            </ul>

                            <p>
                                Any errors or omissions in any content or for any loss or damage incurred as a result of the use of any content posted, emailed, transmitted, or otherwise made available through our services
                            </p>

                            <h2 className='purple'>
                                10. Indemnification
                            </h2>

                            <p>
                                You agree to indemnify, defend, and hold harmless Platform360° and its affiliates, officers, employees, agents, and partners from and against any claims, liabilities, damages, losses, and expenses, including reasonable attorneys' fees, arising out of or in any way connected with your access to or use of our services, your violation of these Terms, or your infringement of any intellectual property or other rights of any person or entity.
                            </p>

                            <h2 className='purple'>
                                11. Termination
                            </h2>

                            <p>
                                We reserve the right to terminate or suspend your access to our services at any time, with or without cause or notice. Upon termination, your right to use our services will immediately cease, and you must cease all use of our services and return or destroy any materials obtained from us.
                            </p>

                            <h2 className='purple'>
                                12. Governing Law
                            </h2>
                            
                            <p>
                                These Terms and your use of our services are governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law principles. Any legal action or proceeding arising under these Terms shall be brought exclusively in the courts located in New York, and you consent to the personal jurisdiction and venue of such courts.
                            </p>

                            <h2 className='purple'>
                                13. Changes to These Terms
                            </h2>
                            
                            <p>
                                We may update these Terms from time to time. When we do, we will post the revised Terms on our website and update the effective date. Your continued use of our services after the changes have been posted constitutes your acceptance of the revised Terms.
                            </p>

                            <h2 className='purple'>
                                14. Contact Us
                            </h2>
                            
                            <p>
                                If you have any questions or concerns about this Termsn and Conditions or our data practices, please contact us at:
                            </p>

                            <p>
                                Platform 360<br />
                                34th 33rd Street<br />
                                New York, NY<br />
                                <a href={email(contact.email)}>{contact.email}</a>
                            </p>
                            
                            <p>
                                By using our services, you acknowledge that you have read and understood this Terms and Conditions and agree to its terms. 
                            </p>

                            <p>
                                Thank you for trusting Platform360.ai with your data.
                            </p>

                        </div>
                    </div>
                </section>
            </main>
        </OtherWrapper>
    )
}