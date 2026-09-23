import RoleSelectionPage from "../features/auth/RoleSelectionPage.jsx";
import SignupPage from "../features/auth/SignupPage.jsx";
import LoginPage from "../features/auth/LoginPage.jsx";
import VerifyCodePage from "../features/auth/VerifyCodePage.jsx";
import ForgotPasswordPage from "../features/auth/ForgotPasswordPage.jsx";
import ResetPasswordPage from "../features/auth/ResetPasswordPage.jsx";
import CreatorOnboardingPage from "../features/onboarding/CreatorOnboardingPage.jsx";
import BrandOnboardingPage from "../features/onboarding/BrandOnboardingPage.jsx";
import CreatorProfile from "../features/profile/CreatorProfile.jsx";
import CreatorProfileForm from "../features/profile/CreatorProfileForm.jsx";
import BrandProfile from "../features/profile/BrandProfile.jsx";
import BrandProfileForm from "../features/profile/BrandProfileForm.jsx";
import PublicCreatorProfilePage from "../features/profile/PublicCreatorProfilePage.jsx";
import PublicBrandProfilePage from "../features/profile/PublicBrandProfilePage.jsx";
import AccountMenu from "../components/account/AccountMenu.jsx";
import AccountSettingsPage from "../features/account/AccountSettingsPage.jsx";
import CampaignDiscoveryPage from "../features/discovery/CampaignDiscoveryPage.jsx";
import CampaignDetails from "../components/details/CampaignDetails.jsx";
import CreatorDiscoveryPage from "../features/discovery/CreatorDiscoveryPage.jsx";
import CreatorDetails from "../components/details/CreatorDetails.jsx";
import FilterSheet from "../features/discovery/FilterSheet.jsx";
import CreatorInboxPage from "../features/chats/CreatorInboxPage.jsx";
import BrandInboxPage from "../features/chats/BrandInboxPage.jsx";
import ConversationPage from "../features/chats/ConversationPage.jsx";
import LikedCampaignsPage from "../features/saved/LikedCampaignsPage.jsx";
import CreatorShortlistPage from "../features/saved/CreatorShortlistPage.jsx";
import MatchesPage from "../features/chats/MatchesPage.jsx";
import InterestedCreatorsPage from "../features/campaigns/InterestedCreatorsPage.jsx";
import CampaignsPage from "../features/campaigns/CampaignsPage.jsx";
import CreateCampaignPage from "../features/campaigns/CreateCampaignPage.jsx";
import EditCampaignPage from "../features/campaigns/EditCampaignPage.jsx";
import CampaignStatusPage from "../features/campaigns/CampaignStatusPage.jsx";
import CampaignPreviewPage from "../features/campaigns/CampaignPreviewPage.jsx";
import SubscribePage from "../features/billing/SubscribePage.jsx";
import BillingPage from "../features/billing/BillingPage.jsx";
import SubscriptionRequiredDialog from "../features/billing/SubscriptionRequiredDialog.jsx";
import HelpCenterPage from "../features/support/HelpCenterPage.jsx";
import TermsPage from "../features/legal/TermsPage.jsx";
import PrivacyPage from "../features/legal/PrivacyPage.jsx";
import RefundPolicyPage from "../features/legal/RefundPolicyPage.jsx";
import ContactPage from "../features/support/ContactPage.jsx";
import AdminLoginPage from "../features/admin/AdminLoginPage.jsx";
import UsersPage from "../features/admin/UsersPage.jsx";
import VerificationQueuePage from "../features/admin/VerificationQueuePage.jsx";
import CampaignModerationPage from "../features/admin/CampaignModerationPage.jsx";
import SubscriptionsPage from "../features/admin/SubscriptionsPage.jsx";
import ReportsPage from "../features/admin/ReportsPage.jsx";
export const screens = {
"Pick your side": RoleSelectionPage,
"Create account": SignupPage,
"Log in": LoginPage,
"Enter code": VerifyCodePage,
"Forgot password": ForgotPasswordPage,
"Reset password": ResetPasswordPage,
"Creator onboarding": CreatorOnboardingPage,
"Brand onboarding": BrandOnboardingPage,
"Creator profile": CreatorProfile,
"Creator profile edit": CreatorProfileForm,
"Brand profile": BrandProfile,
"Brand profile edit": BrandProfileForm,
"Creator, as brands see it": PublicCreatorProfilePage,
"Brand, as creators see it": PublicBrandProfilePage,
"Account menu": AccountMenu,
"Account settings": AccountSettingsPage,
"Campaign discovery": CampaignDiscoveryPage,
"Campaign detail sheet": CampaignDetails,
"Creator discovery": CreatorDiscoveryPage,
"Creator detail sheet": CreatorDetails,
"Filter sheet": FilterSheet,
"Inbox · creator": CreatorInboxPage,
"Inbox · brand": BrandInboxPage,
"Conversation": ConversationPage,
"Liked campaigns": LikedCampaignsPage,
"Shortlist": CreatorShortlistPage,
"Matches": MatchesPage,
"Creators who liked this": InterestedCreatorsPage,
"Campaigns": CampaignsPage,
"Create campaign": CreateCampaignPage,
"Edit campaign": EditCampaignPage,
"Campaign status": CampaignStatusPage,
"Card preview": CampaignPreviewPage,
"Subscribe": SubscribePage,
"Billing": BillingPage,
"Locked": SubscriptionRequiredDialog,
"Help center": HelpCenterPage,
"Terms": TermsPage,
"Privacy policy": PrivacyPage,
"Refund and cancellation": RefundPolicyPage,
"Contact": ContactPage,
"admin:Admin login": AdminLoginPage,
"admin:Users": UsersPage,
"admin:Verification queue": VerificationQueuePage,
"admin:Campaign moderation": CampaignModerationPage,
"admin:Subscriptions": SubscriptionsPage,
"admin:Reports": ReportsPage
};
