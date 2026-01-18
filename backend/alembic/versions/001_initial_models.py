"""Initial models - clients, users, metrics tables

Revision ID: 001_initial
Revises: 
Create Date: 2026-01-17

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '001_initial'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ==========================================================================
    # CLIENTS TABLE
    # ==========================================================================
    op.create_table(
        'clients',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('slug', sa.String(length=100), nullable=True),
        sa.Column('active', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('meta_ad_account_id', sa.String(length=50), nullable=True),
        sa.Column('meta_access_token', sa.Text(), nullable=True),
        sa.Column('config', postgresql.JSONB(astext_type=sa.Text()), nullable=False, server_default='{}'),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id', name=op.f('pk_clients'))
    )
    op.create_index(op.f('ix_clients_id'), 'clients', ['id'], unique=False)
    op.create_index(op.f('ix_clients_name'), 'clients', ['name'], unique=False)
    op.create_index(op.f('ix_clients_slug'), 'clients', ['slug'], unique=False)
    op.create_index(op.f('uq_clients_slug'), 'clients', ['slug'], unique=True)

    # ==========================================================================
    # USERS TABLE
    # ==========================================================================
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('auth0_sub', sa.String(length=255), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('is_superuser', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('full_name', sa.String(length=255), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id', name=op.f('pk_users'))
    )
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=False)
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=False)
    op.create_index(op.f('uq_users_email'), 'users', ['email'], unique=True)
    op.create_index(op.f('ix_users_auth0_sub'), 'users', ['auth0_sub'], unique=False)
    op.create_index(op.f('uq_users_auth0_sub'), 'users', ['auth0_sub'], unique=True)

    # ==========================================================================
    # METRICS TABLE
    # ==========================================================================
    op.create_table(
        'metrics',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('client_id', sa.Integer(), nullable=False),
        sa.Column('date', sa.DateTime(), nullable=False),
        sa.Column('platform', sa.String(length=50), nullable=False),
        sa.Column('impressions', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('clicks', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('spend', sa.Float(), nullable=False, server_default='0.0'),
        sa.Column('leads', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('raw_data', postgresql.JSONB(astext_type=sa.Text()), nullable=False, server_default='{}'),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.ForeignKeyConstraint(['client_id'], ['clients.id'], name=op.f('fk_metrics_client_id_clients'), ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id', name=op.f('pk_metrics'))
    )
    op.create_index(op.f('ix_metrics_id'), 'metrics', ['id'], unique=False)
    op.create_index(op.f('ix_metrics_client_id'), 'metrics', ['client_id'], unique=False)
    op.create_index(op.f('ix_metrics_date'), 'metrics', ['date'], unique=False)
    op.create_index(op.f('ix_metrics_platform'), 'metrics', ['platform'], unique=False)


def downgrade() -> None:
    # Drop tables in reverse order (respecting foreign key dependencies)
    op.drop_table('metrics')
    op.drop_table('users')
    op.drop_table('clients')
