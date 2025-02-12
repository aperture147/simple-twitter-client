export enum UserField {
    Affiliation = 'affiliation',
    ConnectionStatus = 'connection_status',
    CreatedAt = 'created_at',
    Description = 'description',
    Entities = 'entities',
    ID = 'id',
    IsIdentityVerified = 'is_identity_verified',
    Location = 'location',
    MistRecentTweetID = 'most_recent_tweet_id',
    Name = 'name',
    Parody = 'parody',
    PinnedTweetID = 'pinned_tweet_id',
    ProfileBannerURL = 'profile_banner_url',
    ProfileImageURL = 'profile_image_url',
    Protected = 'protected',
    PublicMetrics = 'public_metrics',
    ReceivesYourDM = 'receives_your_dm',
    Subscription = 'subscription',
    SubscriptionType = 'subscription_type',
    URL = 'url',
    Username = 'username',
    Verified = 'verified',
    VerifiedFollowersCount = 'verified_followers_count',
    VerifiedType = 'verified_type',
    Withheld = 'withheld',
}

export enum Expansion {
    AffiliationUserID = 'affiliation.user_id',
    MostRecentTweetID = 'most_recent_tweet_id',
    PinnedTweetID = 'pinned_tweet_id',
}

export enum TweetField {
    Article = 'article',
    Attachments = 'attachments',
    AuthorID = 'author_id',
    CardURI = 'card_uri',
    CommunityID = 'community_id',
    ContextAnnotations = 'context_annotations',
    ConversationID = 'conversation_id',
    CreatedAt = 'created_at',
    DisplayTextRange = 'display_text_range',
    EditControls = 'edit_controls',
    EditHistoryTweetIDs = 'edit_history_tweet_ids',
    Entities = 'entities',
    Geo = 'geo',
    ID = 'id',
    InReployToUserID = 'in_reply_to_user_id',
    Lang = 'lang',
    MediaMetadata = 'media_metadata',
    NonPublicMetrics = 'non_public_metrics',
    NoteTweet = 'note_tweet',
    OrganicMetrics = 'organic_metrics',
    PossiblySensitive = 'possibly_sensitive',
    PromotedMetrics = 'promoted_metrics',
    PublicMetrics = 'public_metrics',
    ReferencedTweets = 'referenced_tweets',
    ReplySettings = 'reply_settings',
    Scopes = 'scopes',
    Source = 'source',
    Text = 'text',
    Withheld = 'withheld',
}

export enum MediaField {
    AltText = 'alt_text',
    DurationMs = 'duration_ms',
    Height = 'height',
    MediaKey = 'media_key',
    NonPublicMetrics = 'non_public_metrics',
    OrganicMetrics = 'organic_metrics',
    PreviewImageURL = 'preview_image_url',
    PromotedMetrics = 'promoted_metrics',
    PublicMetrics = 'public_metrics',
    Type = 'type',
    URL = 'url',
    Variants = 'variants',
    Width = 'width',
}

export enum PollField {
    DurationMinutes = 'duration_minutes',
    EndDatetime = 'end_datetime',
    ID = 'id',
    Options = 'options',
    VotingStatus = 'voting_status',
}

export enum PlaceField {
    ContainedWithin = 'contained_within',
    Country = 'country',
    CountryCode = 'country_code',
    FullName = 'full_name',
    Geo = 'geo',
    ID = 'id',
    Name = 'name',
    PlaceType = 'place_type',
}

export enum SearchCountField {
    End = 'end',
    Start = 'start',
    TweetCount = 'tweet_count',
}

export enum RulesCountField {
    AllProjectClientApps = 'all_project_client_apps',
    CapPerClientApp = 'cap_per_client_app',
    CapPerProject = 'cap_per_project',
    ClientAppRulesCount = 'client_app_rules_count',
    ProjectRulesCount = 'project_rules_count',
}

export enum PersonalizedTrendField {
    Category = 'category',
    PostCount = 'post_count',
    TrendName = 'trend_name',
    TrendingSince = 'trending_since',
}