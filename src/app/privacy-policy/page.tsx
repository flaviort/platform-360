// libraries
import clsx from 'clsx'

// layouts
import OtherWrapper from '@/layouts/Other'

// utils
import { contact } from '@/utils/routes'
import { email } from '@/utils/functions'

// css
import styles from './index.module.scss'

export default function PrivacyPolicy() {
    return (
        <OtherWrapper>
            <main className={styles.page}>
                
                <section className='py-smaller bg-gray-100'>
                    <div className="container">
                        
                        <h1 className='text-65 bold blue'>
                            Privacy Policy
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
                                Platform360.ai a Market Research and Insights Company ("we", "our", "us") is committed to protecting the privacy and security of our clients' information. This Privacy Policy outlines how we collect, use, disclose, and protect your data. By using our services, you agree to the practices described in this policy.
                            </p>

                            <h2 className='purple'>
                                1. Information We Collect
                            </h2>
                            
                            <ul>

                                <li>
                                    Client Data: We collect information from our clients necessary to provide our market research services, including:
                                </li>

                                <li>
                                    Contact information (name, email address, phone number)
                                </li>

                                <li>
                                    Company information (company name, job title, business address)
                                </li>

                                <li>
                                    Payment information (billing details)
                                </li>

                                <li>
                                    Any other information you provide to us directly
                                </li>

                            </ul>

                            <p>
                                Third-Party Data: In certain cases, we rely on third-party data sources for our market research and do not collect or retain consumer data directly.
                            </p>

                            <h2 className='purple'>
                                2. Use of Information
                            </h2>
                            
                            <p>
                                We use the information we collect to:
                            </p>

                            <ul>

                                <li>
                                    Provide and improve our market research services    
                                </li>

                                <li>
                                    Communicate with you about our services, updates, and promotions
                                </li>

                                <li>
                                    Process transactions and manage your account
                                </li>

                                <li>
                                    Respond to your inquiries and provide customer support
                                </li>

                                <li>
                                    Comply with legal obligations and protect our legal rights
                                </li>
                                
                            </ul>
                            
                            <h2 className='purple'>
                                3. Sharing of Information
                            </h2>

                            <p>
                                We may share your information with:
                            </p>

                            <ul>
                                <li>
                                    Service Providers: Third-party vendors who assist us in providing our services, such as payment processors, data analytics providers, and IT service providers. These vendors are contractually obligated to safeguard your information and use it only for the purposes we specify.
                                </li>

                                <li>
                                    Legal Requirements: If required by law or in response to valid legal process, we may disclose your information to government authorities or other third parties.
                                </li>

                                <li>
                                    Business Transfers: In the event of a merger, acquisition, or sale of all or a portion of our assets, your information may be transferred to the new owner as part of the transaction.
                                </li>

                            </ul>

                            <h2 className='purple'>
                                4. Data Security
                            </h2>

                            <p>
                                We implement appropriate technical and organizational measures to protect your data from unauthorized access, disclosure, alteration, or destruction. Despite our efforts, no data transmission or storage system can be guaranteed 100% secure.
                            </p>

                            <h2 className='purple'>
                                5. Data Retention
                            </h2>
                            
                            <p>
                                We retain your information only for as long as necessary to fulfill the purposes for which it was collected or to comply with legal, regulatory, or internal policy requirements.
                            </p>

                            <h2 className='purple'>
                                6. Your Rights and Choices
                            </h2>
                            
                            <p>
                                You have the right to:
                            </p>

                            <ul>

                                <li>
                                    Access, correct, or delete your information
                                </li>

                                <li>
                                    Object to or restrict the processing of your data
                                </li>

                                <li>
                                    Withdraw consent for data processing where consent was previously provided
                                </li>

                                <li>
                                    Lodge a complaint with a data protection authority
                                </li>

                            </ul>

                            <p>
                                To exercise these rights, please contact us using the information provided below.
                            </p>

                            <h2 className='purple'>
                                7. Changes to This Privacy Policy
                            </h2>
                            
                            <p>
                                We may update this Privacy Policy from time to time. When we do, we will try to post the revised policy 30 days in advance on our website and update the effective date. We encourage you to review this policy periodically for any changes.
                            </p>

                            <h2 className='purple'>
                                8. Contact Us
                            </h2>
                            
                            <p>
                                If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:
                            </p>

                            <p>
                                Platform 360<br />
                                34th 33rd Street<br />
                                New York, NY<br />
                                <a href={email(contact.email)}>{contact.email}</a>
                            </p>
                            
                            <p>
                                By using our services, you acknowledge that you have read and understood this Privacy Policy and agree to its terms. 
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