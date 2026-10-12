"""Canonical character assets and deterministic result-card selection."""

CHARACTER_IDS = ('byte', 'kai', 'nova', 'mira', 'zed')

CHARACTERS = {
    'byte': {'name': 'Byte', 'poses': ('idle', 'thinking', 'happy', 'motivating', 'celebrating')},
    'kai': {'name': 'Kai', 'poses': ('idle', 'thinking', 'happy', 'motivating', 'celebrating')},
    'nova': {'name': 'Nova', 'poses': ('idle', 'thinking', 'happy', 'motivating', 'celebrating')},
    'mira': {'name': 'Mira', 'poses': ('idle', 'thinking', 'happy', 'motivating', 'celebrating')},
    'zed': {'name': 'Zed', 'poses': ('idle', 'thinking', 'happy', 'motivating', 'celebrating')},
}

CARD_POSES = {
    'EXCELLENT': 'celebrating',
    'GREAT': 'happy',
    'GOOD_TRY': 'motivating',
    'TRY_AGAIN': 'thinking',
}


def normalize_character(value):
    value = str(value or '').lower()
    return value if value in CHARACTER_IDS else 'byte'


def result_card(character, tier):
    character = normalize_character(character)
    if tier not in CARD_POSES:
        raise ValueError('Unknown result tier.')
    return {
        'character': character,
        'character_name': CHARACTERS[character]['name'],
        'tier': tier,
        'pose': CARD_POSES[tier],
    }