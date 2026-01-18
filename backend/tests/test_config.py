import os
from pathlib import Path
import pytest
from app.core.config_loader import expand_env_vars, load_config_yaml, _type_coerce


def test_expand_env_vars():
    os.environ["TEST_VAR"] = "hello"
    assert expand_env_vars("${TEST_VAR}") == "hello"
    assert expand_env_vars("${UNDEFINED_VAR:-default}") == "default"
    assert expand_env_vars("${UNDEFINED_VAR}") == ""
    
    # Nested
    data = {"key": "${TEST_VAR}", "list": ["${TEST_VAR}"]}
    expanded = expand_env_vars(data)
    assert expanded["key"] == "hello"
    assert expanded["list"][0] == "hello"


def test_type_coerce():
    assert _type_coerce("true") is True
    assert _type_coerce("FALSE") is False
    assert _type_coerce("123") == 123
    assert _type_coerce("null") is None
    assert _type_coerce("") is None
    assert _type_coerce("normal string") == "normal string"


def test_load_config_invalid_schema(tmp_path):
    # Create invalid config
    config_file = tmp_path / "settings.yaml"
    config_file.write_text("app: { project_name: 123 }") # Should be string
    
    schema_file = tmp_path / "schema.json"
    schema_file.write_text("""
    {
        "type": "object",
        "properties": {
            "app": {
                "type": "object",
                "properties": { "project_name": { "type": "string" } }
            }
        }
    }
    """)
    
    with pytest.raises(ValueError, match="Configuration validation failed"):
        load_config_yaml(config_file, schema_file)


def test_settings_load_success():
    # This tests the real settings file if env vars are present
    # We mock env vars for required fields
    os.environ["AUTH0_DOMAIN"] = "test.auth0.com"
    os.environ["AUTH0_API_AUDIENCE"] = "https://api.test.com"
    
    from app.core.config import Settings
    s = Settings.load()
    assert s.AUTH0_DOMAIN == "test.auth0.com"
    assert s.PROJECT_NAME == "Ads Administrator"
