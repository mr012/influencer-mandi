# Screen map

All 47 source templates are retained. Role variants and overlays are not separate public URLs.

| Source template | JSX file |
|---|---|
| Pick your side | `src/features/auth/RoleSelectionPage.jsx` |
| Create account | `src/features/auth/SignupPage.jsx` |
| Log in | `src/features/auth/LoginPage.jsx` |
| Enter code | `src/features/auth/VerifyCodePage.jsx` |
| Forgot password | `src/features/auth/ForgotPasswordPage.jsx` |
| Reset password | `src/features/auth/ResetPasswordPage.jsx` |
| Creator onboarding | `src/features/onboarding/CreatorOnboardingPage.jsx` |
| Brand onboarding | `src/features/onboarding/BrandOnboardingPage.jsx` |
| Creator profile | `src/features/profile/CreatorProfile.jsx` |
| Creator profile edit | `src/features/profile/CreatorProfileForm.jsx` |
| Brand profile | `src/features/profile/BrandProfile.jsx` |
| Brand profile edit | `src/features/profile/BrandProfileForm.jsx` |
| Creator, as brands see it | `src/features/profile/PublicCreatorProfilePage.jsx` |
| Brand, as creators see it | `src/features/profile/PublicBrandProfilePage.jsx` |
| Account menu | `src/components/account/AccountMenu.jsx` |
| Account settings | `src/features/account/AccountSettingsPage.jsx` |
| Campaign discovery | `src/features/discovery/CampaignDiscoveryPage.jsx` |
| Creator discovery | `src/features/discovery/CreatorDiscoveryPage.jsx` |
| Campaign detail sheet | `src/components/details/CampaignDetails.jsx` |
| Creator detail sheet | `src/components/details/CreatorDetails.jsx` |
| Filter sheet | `src/features/discovery/FilterSheet.jsx` |
| Inbox · creator | `src/features/chats/CreatorInboxPage.jsx` |
| Inbox · brand | `src/features/chats/BrandInboxPage.jsx` |
| Conversation | `src/features/chats/ConversationPage.jsx` |
| Liked campaigns | `src/features/saved/LikedCampaignsPage.jsx` |
| Shortlist | `src/features/saved/CreatorShortlistPage.jsx` |
| Matches | `src/features/chats/MatchesPage.jsx` |
| Creators who liked this | `src/features/campaigns/InterestedCreatorsPage.jsx` |
| Campaigns | `src/features/campaigns/CampaignsPage.jsx` |
| Create campaign | `src/features/campaigns/CreateCampaignPage.jsx` |
| Edit campaign | `src/features/campaigns/EditCampaignPage.jsx` |
| Campaign status | `src/features/campaigns/CampaignStatusPage.jsx` |
| Card preview | `src/features/campaigns/CampaignPreviewPage.jsx` |
| Subscribe | `src/features/billing/SubscribePage.jsx` |
| Billing | `src/features/billing/BillingPage.jsx` |
| Locked | `src/features/billing/SubscriptionRequiredDialog.jsx` |
| Help center | `src/features/support/HelpCenterPage.jsx` |
| Terms | `src/features/legal/TermsPage.jsx` |
| Privacy policy | `src/features/legal/PrivacyPage.jsx` |
| Refund and cancellation | `src/features/legal/RefundPolicyPage.jsx` |
| Contact | `src/features/support/ContactPage.jsx` |
| admin:Admin login | `src/features/admin/AdminLoginPage.jsx` |
| admin:Users | `src/features/admin/UsersPage.jsx` |
| admin:Verification queue | `src/features/admin/VerificationQueuePage.jsx` |
| admin:Campaign moderation | `src/features/admin/CampaignModerationPage.jsx` |
| admin:Subscriptions | `src/features/admin/SubscriptionsPage.jsx` |
| admin:Reports | `src/features/admin/ReportsPage.jsx` |

Internal route keys are defined in `src/config/routes.js`. Navigation remains the original in-memory route stack. The app does not currently implement browser history routing.
