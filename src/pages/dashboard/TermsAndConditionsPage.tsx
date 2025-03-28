import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

const TermsAndConditionsPage = () => {
	const currentDate = new Date().toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	return (
		<div className="min-h-screen bg-[#FFF0DC] py-8 px-4 md:px-8">
			<Card className="max-w-4xl mx-auto shadow-lg border-[#F0BB78] border-2">
				<CardContent className="p-6">
					<div className="space-y-6 text-[#543A14]">
						<div className="text-center space-y-2">
							<h1 className="text-3xl font-bold">Terms and Conditions</h1>
							<p className="text-sm">Last Updated: {currentDate}</p>
						</div>

						<p className="text-sm md:text-base">
							Welcome to Cashly, an innovative financial tracking application
							(hereinafter referred to as "the App"), designed to empower users
							with advanced financial management capabilities while maintaining
							the highest standards of privacy and security. These Terms and
							Conditions (hereinafter referred to as "Terms") constitute a
							legally binding agreement between you (hereinafter referred to as
							"User") and Cashly, governing the User's access to and utilization
							of the App's services, features, and functionalities. By
							accessing, registering for, or otherwise utilizing the App in any
							manner, the User explicitly acknowledges and agrees to comply with
							these Terms, as they may be updated from time to time, at the sole
							discretion of Cashly.
						</p>

						<Separator className="bg-[#F0BB78]" />

						<ScrollArea className="h-96 md:h-[32rem] pr-4">
							<div className="space-y-8">
								<section>
									<h2 className="text-xl font-bold mb-3">1. Introduction</h2>
									<p>
										Cashly is a technologically advanced, intuitive, and
										user-centric financial tracking platform that provides Users
										with the capability to meticulously record, analyze, and
										manage personal financial transactions and savings goals.
										These Terms delineate the scope, responsibilities,
										obligations, and conditions that govern the User's
										interaction with the App, encompassing, but not limited to,
										data management, privacy measures, third-party engagements,
										and security protocols.
									</p>
								</section>

								<section>
									<h2 className="text-xl font-bold mb-3">
										2. User Data Collection & Usage
									</h2>
									<ul className="list-disc pl-6 space-y-2">
										<li>
											In order to optimize the User experience, the App collects
											and processes transactional data, financial input details,
											and personal savings goals that Users voluntarily provide
											within the App's ecosystem.
										</li>
										<li>
											The collected data is subject to industry-standard
											encryption methodologies, ensuring that all stored
											information remains protected and anonymized.
										</li>
										<li>
											Cashly reserves the right to leverage aggregated,
											depersonalized, and de-identified data sets for the
											purpose of statistical analysis, feature enhancements,
											operational improvements, research initiatives, and
											potential monetization strategies, all while maintaining
											strict compliance with privacy laws and data protection
											regulations.
										</li>
										<li>
											Users expressly consent to such collection, processing,
											and utilization of data by continuing to engage with the
											App.
										</li>
									</ul>
								</section>

								<section>
									<h2 className="text-xl font-bold mb-3">
										3. Data Confidentiality & Security
									</h2>
									<ul className="list-disc pl-6 space-y-2">
										<li>
											Cashly implements sophisticated, multi-layered encryption
											mechanisms and advanced cybersecurity protocols to ensure
											that User data is securely stored, transmitted, and
											processed without risk of unauthorized access or breaches.
										</li>
										<li>
											No personally identifiable information (PII) is accessible
											to any third-party entity or even to the developers of
											Cashly in any identifiable format.
										</li>
										<li>
											Notwithstanding the robust security measures in place,
											Users acknowledge that no system is entirely immune to
											potential vulnerabilities, and they agree to adopt best
											practices in securing their own account credentials and
											financial data.
										</li>
									</ul>
								</section>

								<section>
									<h2 className="text-xl font-bold mb-3">
										4. Third-Party Data Sharing
									</h2>
									<ul className="list-disc pl-6 space-y-2">
										<li>
											Cashly may collaborate with third-party service providers,
											analytics platforms, or research institutions for the
											purposes of improving the App's functionality, deriving
											market insights, or enabling strategic business decisions.
										</li>
										<li>
											Any shared data will be meticulously anonymized, ensuring
											that no single User can be individually identified or
											traced.
										</li>
										<li>
											While the App does not share PII with advertisers or
											external entities without explicit consent, Users
											acknowledge that aggregated financial data trends may be
											utilized to enhance business operations.
										</li>
										<li>
											Users retain the right to opt out of non-essential data
											sharing by submitting a formal request through designated
											communication channels within the App.
										</li>
									</ul>
								</section>

								<section>
									<h2 className="text-xl font-bold mb-3">
										5. User Rights & Responsibilities
									</h2>
									<ul className="list-disc pl-6 space-y-2">
										<li>
											Users are expected to provide accurate, truthful, and
											up-to-date financial data while utilizing the App's
											functionalities.
										</li>
										<li>
											It is the User's sole responsibility to safeguard their
											login credentials, access keys, and any confidential
											information associated with their App account.
										</li>
										<li>
											Users maintain the right to request data access,
											modifications, or permanent deletion of their personal
											data by reaching out to the Cashly support team.
										</li>
										<li>
											Any misuse, unauthorized attempts to manipulate data, or
											fraudulent activity within the App will be grounds for
											immediate account termination and potential legal action.
										</li>
									</ul>
								</section>

								<section>
									<h2 className="text-xl font-bold mb-3">
										6. Limitation of Liability
									</h2>
									<ul className="list-disc pl-6 space-y-2">
										<li>
											Cashly provides the App on an "as is" and "as available"
											basis without any warranties, express or implied.
										</li>
										<li>
											Under no circumstances shall Cashly be liable for direct,
											indirect, incidental, special, consequential, or exemplary
											damages arising from financial losses, incorrect
											transactions, or the User's reliance on the App's data and
											analytics.
										</li>
										<li>
											Users acknowledge that financial decisions should not be
											made solely based on the App's output and should be
											verified independently through external means.
										</li>
									</ul>
								</section>

								<section>
									<h2 className="text-xl font-bold mb-3">
										7. Modifications to Terms
									</h2>
									<ul className="list-disc pl-6 space-y-2">
										<li>
											Cashly reserves the right to update, modify, revise, or
											replace these Terms at any given time, at its sole
											discretion, without prior notice.
										</li>
										<li>
											Users will be notified of substantial changes to these
											Terms through in-app notifications, email communications,
											or other appropriate channels.
										</li>
										<li>
											Continued usage of the App following any modifications to
											these Terms shall constitute acceptance of the revised
											Terms.
										</li>
									</ul>
								</section>

								<section>
									<h2 className="text-xl font-bold mb-3">8. Governing Law</h2>
									<ul className="list-disc pl-6 space-y-2">
										<li>
											These Terms and any related disputes shall be governed by,
											construed, and enforced in accordance with the laws of
											United Arab Emirates (UAE), without regard to conflict of
											law principles.
										</li>
										<li>
											In the event of any legal dispute arising from or related
											to these Terms, the parties agree to first attempt to
											resolve the matter amicably before resorting to legal
											proceedings in a competent jurisdiction.
										</li>
									</ul>
								</section>

								<div className="text-center pt-4 pb-8">
									<p>
										For any inquiries, concerns, or requests, please contact our
										support team at .
									</p>
									<p className="mt-4 font-medium">
										Thank you for choosing Cashly for your financial management
										needs.
									</p>
								</div>
							</div>
						</ScrollArea>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default TermsAndConditionsPage;
