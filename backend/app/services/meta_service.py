"""
Meta (Facebook) Ads Service - Integration with Meta Marketing API.

Provides methods to fetch insights and manage advertising campaigns.
Uses the facebook_business SDK for API interactions.
"""
from typing import Any
from datetime import date, timedelta

from facebook_business.api import FacebookAdsApi
from facebook_business.adobjects.adaccount import AdAccount
from facebook_business.adobjects.adsinsights import AdsInsights

from app.core.config import settings


class MetaService:
    """
    Service for interacting with Meta (Facebook) Ads API.
    
    Usage:
        service = MetaService(access_token="...")
        insights = await service.get_insights("123456789")
    
    Note: The facebook_business SDK is synchronous, so methods are not async.
    Consider running in a thread pool for production use.
    """
    
    def __init__(self, access_token: str) -> None:
        """
        Initialize the Meta Ads API client.
        
        Args:
            access_token: User or system access token with ads_read permission.
        """
        self.access_token = access_token
        self._api = FacebookAdsApi.init(
            access_token=access_token,
            app_id=settings.META_APP_ID,
            app_secret=settings.META_APP_SECRET,
        )
    
    def get_ad_account(self, ad_account_id: str) -> AdAccount:
        """
        Get an AdAccount object.
        
        Args:
            ad_account_id: The ad account ID (without 'act_' prefix).
            
        Returns:
            AdAccount object for API operations.
        """
        # Add 'act_' prefix if not present
        if not ad_account_id.startswith("act_"):
            ad_account_id = f"act_{ad_account_id}"
        return AdAccount(ad_account_id)
    
    def get_insights(
        self,
        ad_account_id: str,
        date_preset: str = "last_30d",
        level: str = "account",
    ) -> list[dict[str, Any]]:
        """
        Fetch insights for a specific ad account.
        
        Args:
            ad_account_id: The ad account ID.
            date_preset: Time range preset (last_7d, last_30d, this_month, etc.)
            level: Aggregation level (account, campaign, adset, ad)
            
        Returns:
            List of insight dictionaries with performance metrics.
        """
        account = self.get_ad_account(ad_account_id)
        
        params = {
            "date_preset": date_preset,
            "level": level,
            "fields": [
                AdsInsights.Field.impressions,
                AdsInsights.Field.clicks,
                AdsInsights.Field.spend,
                AdsInsights.Field.actions,
                AdsInsights.Field.ctr,
                AdsInsights.Field.cpc,
                AdsInsights.Field.cpm,
                AdsInsights.Field.date_start,
                AdsInsights.Field.date_stop,
            ],
        }
        
        try:
            insights = account.get_insights(params=params)
            return [insight.export_all_data() for insight in insights]
        except Exception as e:
            # Log the error and return empty list or raise
            # In production, implement proper error handling
            raise MetaApiError(f"Failed to fetch insights: {e}") from e
    
    def get_insights_by_date_range(
        self,
        ad_account_id: str,
        date_from: date,
        date_to: date,
        level: str = "account",
    ) -> list[dict[str, Any]]:
        """
        Fetch insights for a specific date range.
        
        Args:
            ad_account_id: The ad account ID.
            date_from: Start date (inclusive).
            date_to: End date (inclusive).
            level: Aggregation level.
            
        Returns:
            List of insight dictionaries.
        """
        account = self.get_ad_account(ad_account_id)
        
        params = {
            "time_range": {
                "since": date_from.isoformat(),
                "until": date_to.isoformat(),
            },
            "level": level,
            "time_increment": 1,  # Daily breakdown
            "fields": [
                AdsInsights.Field.impressions,
                AdsInsights.Field.clicks,
                AdsInsights.Field.spend,
                AdsInsights.Field.actions,
                AdsInsights.Field.date_start,
                AdsInsights.Field.date_stop,
            ],
        }
        
        try:
            insights = account.get_insights(params=params)
            return [insight.export_all_data() for insight in insights]
        except Exception as e:
            raise MetaApiError(f"Failed to fetch insights: {e}") from e


class MetaApiError(Exception):
    """Custom exception for Meta API errors."""
    pass


# =============================================================================
# MOCK SERVICE FOR DEVELOPMENT/TESTING
# =============================================================================

class MockMetaService:
    """
    Mock Meta service for development and testing.
    
    Returns realistic-looking sample data without making actual API calls.
    """
    
    def __init__(self, access_token: str) -> None:
        self.access_token = access_token
    
    def get_insights(
        self,
        ad_account_id: str,
        date_preset: str = "last_30d",
        level: str = "account",
    ) -> list[dict[str, Any]]:
        """Return mock insights data."""
        today = date.today()
        return [
            {
                "impressions": "15000",
                "clicks": "450",
                "spend": "250.50",
                "ctr": "3.0",
                "cpc": "0.56",
                "cpm": "16.70",
                "actions": [
                    {"action_type": "lead", "value": "25"},
                    {"action_type": "link_click", "value": "450"},
                ],
                "date_start": (today - timedelta(days=30)).isoformat(),
                "date_stop": today.isoformat(),
            }
        ]
    
    def get_insights_by_date_range(
        self,
        ad_account_id: str,
        date_from: date,
        date_to: date,
        level: str = "account",
    ) -> list[dict[str, Any]]:
        """Return mock daily insights data."""
        results = []
        current = date_from
        
        while current <= date_to:
            results.append({
                "impressions": str(500 + (current.day * 10)),
                "clicks": str(15 + current.day),
                "spend": f"{8.50 + current.day:.2f}",
                "actions": [
                    {"action_type": "lead", "value": str(current.day % 3)},
                ],
                "date_start": current.isoformat(),
                "date_stop": current.isoformat(),
            })
            current += timedelta(days=1)
        
        return results
