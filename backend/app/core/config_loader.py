import json
import os
import re
from pathlib import Path
from typing import Any, Dict

import yaml
from jsonschema import validate, ValidationError


def env_var_constructor(loader: yaml.SafeLoader, node: yaml.Node) -> str:
    """
    YAML constructor to expand environment variables in the form of ${VAR:-default}.
    """
    value = loader.construct_scalar(node)
    return expand_env_vars(value)


def expand_env_vars(value: Any) -> Any:
    """
    Recursively expand environment variables in strings.
    Supports ${VAR} and ${VAR:-default}.
    """
    if isinstance(value, str):
        # Match ${VAR} or ${VAR:-default}
        pattern = re.compile(r"\$\{(?P<var>[A-Z0-9_]+)(?::-(?P<default>[^}]*))?\}")
        
        def replace(match: re.Match) -> str:
            var = match.group("var")
            default = match.group("default")
            return os.environ.get(var, default if default is not None else "")

        return pattern.sub(replace, value)
    
    if isinstance(value, dict):
        return {k: expand_env_vars(v) for k, v in value.items()}
    
    if isinstance(value, list):
        return [expand_env_vars(v) for v in value]
    
    return value


def load_config_yaml(config_path: Path, schema_path: Path) -> Dict[str, Any]:
    """
    Loads YAML config, expands env vars, and validates against JSON schema.
    """
    if not config_path.exists():
        raise FileNotFoundError(f"Config file not found: {config_path}")
    
    if not schema_path.exists():
        raise FileNotFoundError(f"Schema file not found: {schema_path}")

    # Load YAML
    with open(config_path, "r") as f:
        # We don't use the constructor directly in yaml.safe_load 
        # to handle numbers/booleans correctly after expansion
        raw_config = yaml.safe_load(f)
    
    # Expand environment variables
    config = expand_env_vars(raw_config)
    
    # Load Schema
    with open(schema_path, "r") as f:
        schema = json.load(f)
    
    # Cast some strings back to their expected types after env expansion (e.g. "true" -> True)
    # This is a bit manual but necessary because YAML loader sees "${DEBUG}" as string
    config = _type_coerce(config)

    # Validate
    try:
        validate(instance=config, schema=schema)
    except ValidationError as e:
        raise ValueError(f"Configuration validation failed: {e.message}") from e
    
    return config


def _type_coerce(data: Any) -> Any:
    """
    Helper to coerce common string representations of types back to Python types
    after environment variable expansion.
    """
    if isinstance(data, str):
        if data.lower() == "true":
            return True
        if data.lower() == "false":
            return False
        if data.isdigit():
            return int(data)
        if data == "" or data.lower() == "null":
            return None
        return data
    
    if isinstance(data, dict):
        return {k: _type_coerce(v) for k, v in data.items()}
    
    if isinstance(data, list):
        return [_type_coerce(v) for v in data]
    
    return data
