import sys
import types
import importlib
import os

# Build a minimal pygame stub for testing
class DummyRect(dict):
    pass

class DummySurface:
    def convert_alpha(self):
        return self
    def subsurface(self, rect):
        return DummySurface()
    def get_width(self):
        return 1024
    def get_rect(self, **kwargs):
        r = DummyRect()
        r.update(kwargs)
        return r


def setup_pygame():
    pygame = types.SimpleNamespace()
    pygame.init = lambda: None
    pygame.display = types.SimpleNamespace(set_mode=lambda *a, **k: None,
                                           set_caption=lambda *a, **k: None)
    pygame.font = types.SimpleNamespace(SysFont=lambda *a, **k: None)
    pygame.image = types.SimpleNamespace(load=lambda *a, **k: DummySurface())
    pygame.time = types.SimpleNamespace(Clock=lambda: types.SimpleNamespace(tick=lambda *a, **k: None))
    pygame.draw = types.SimpleNamespace(rect=lambda *a, **k: None)
    pygame.event = types.SimpleNamespace(get=lambda: [])
    pygame.quit = lambda: None
    pygame.K_w = pygame.K_s = pygame.K_c = pygame.K_f = pygame.K_SPACE = 0
    pygame.QUIT = pygame.KEYDOWN = 0
    return pygame


def test_tree_initialization_and_growth_images(monkeypatch):
    pygame_stub = setup_pygame()
    sys.modules['pygame'] = pygame_stub
    sys.path.append(os.path.dirname(os.path.dirname(__file__)))
    Main = importlib.import_module('Main')

    expected_keys = {'stage1Growth', 'stage2Growth', 'stage3Growth', 'fullyGrown'}
    assert set(Main.growth_images.keys()) == expected_keys

    tree = Main.Tree(10, 20)
    assert isinstance(tree.rect, dict)
    assert tree.rect.get('topleft') == (10, 20)


