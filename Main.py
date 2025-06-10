import pygame
import random
import sys
import os

# Initialize Pygame
pygame.init()

# Screen settings
WIDTH, HEIGHT = 1024, 1024
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Incremental Camp GUI Prototype")

# Colors
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
GREEN = (0, 200, 0)
RED = (200, 0, 0)

# Fonts
font = pygame.font.SysFont(None, 24)
big_font = pygame.font.SysFont(None, 32)

# Game States
MODE_IDLE = 'idle'
MODE_FIGHT = 'fight'
mode = MODE_IDLE

# Player & Resources
state = {'wood': 0, 'stone': 0, 'food': 0, 'water': 0, 'gold': 0, 'weapon': None}
player_hp = 30
enemy = None

# Load tree spritesheet and slice tiles
ASSETS_DIR = os.path.join(os.path.dirname(__file__), 'Assets', 'Sprites')
tilemap_path = os.path.join(ASSETS_DIR, 'TreeStaged.png')
sheet = pygame.image.load(tilemap_path).convert_alpha()
TILE_SIZE = sheet.get_width() // 3  # each tile 341px

# Corrected growth-stage mapping based on the actual tile layout:
growth_images = {
    'stage1Growth': sheet.subsurface((0, TILE_SIZE, TILE_SIZE, TILE_SIZE)),          # col0, row1: small sprout on grass
    'stage2Growth': sheet.subsurface((TILE_SIZE, TILE_SIZE, TILE_SIZE, TILE_SIZE)),  # col1, row1: small tree on grass
    'stage3Growth': sheet.subsurface((2 * TILE_SIZE, TILE_SIZE, TILE_SIZE, TILE_SIZE)), # col2, row1: medium tree on grass
    'fullyGrown':   sheet.subsurface((2 * TILE_SIZE, 0, TILE_SIZE, TILE_SIZE)),       # col2, row0: large tree
}

class Tree:
    def __init__(self, x, y):
        self.stage = random.choice(list(growth_images.keys()))
        self.image = growth_images[self.stage]
        self.rect = self.image.get_rect(topleft=(x, y))

# Generate a handful of trees at random positions
trees = []
for _ in range(8):
    x = random.randint(0, WIDTH - TILE_SIZE)
    y = random.randint(150, HEIGHT - TILE_SIZE)
    trees.append(Tree(x, y))

# Helper draw functions
def draw_text(text, x, y, font, color=BLACK):
    screen.blit(font.render(text, True, color), (x, y))


def draw_resources():
    y0 = 10
    for key in ['wood', 'stone', 'food', 'water', 'gold']:
        draw_text(f"{key.capitalize()}: {state[key]}", 10, y0, font)
        y0 += 20
    draw_text(f"Weapon: {state['weapon']['name'] if state['weapon'] else 'None'}", 10, y0, font)


def draw_buttons():
    draw_text("[W] Chop Wood", 300, 10, font)
    draw_text("[S] Mine Stone", 300, 30, font)
    draw_text("[C] Craft Club (10 wood)", 300, 50, font)
    draw_text("[F] Tutorial Fight", 300, 70, font)


def start_fight():
    global mode, enemy, player_hp
    mode = MODE_FIGHT
    enemy = {'name': 'Bandit', 'hp': 20, 'max_hp': 20}
    player_hp = 30


def draw_bars():
    # Enemy
    pygame.draw.rect(screen, BLACK, (50, 200, 200, 20), 2)
    pygame.draw.rect(screen, RED, (52, 202, (enemy['hp']/enemy['max_hp'])*196, 16))
    draw_text(f"Enemy HP: {enemy['hp']}/{enemy['max_hp']}", 50, 180, font)
    # Player
    pygame.draw.rect(screen, BLACK, (50, 260, 200, 20), 2)
    pygame.draw.rect(screen, GREEN, (52, 262, (player_hp/30)*196, 16))
    draw_text(f"Player HP: {player_hp}/30", 50, 240, font)
    draw_text("[SPACE] Attack", 300, 240, big_font)


def fight_sequence():
    global mode, state, player_hp
    # Player attacks
    enemy['hp'] = max(enemy['hp'] - state['weapon']['damage'], 0)
    if enemy['hp'] == 0:
        state['gold'] += random.randint(1, 5)
        mode = MODE_IDLE
        return
    # Enemy attacks
    player_hp = max(player_hp - 3, 0)
    if player_hp == 0:
        mode = MODE_IDLE

# Main loop
def main() -> None:
    clock = pygame.time.Clock()
    running = True
    while running:
        screen.fill(WHITE)
        # Draw trees
        for tree in trees:
            screen.blit(tree.image, tree.rect)
        # Event handling
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            elif event.type == pygame.KEYDOWN:
                if mode == MODE_IDLE:
                    if event.key == pygame.K_w:
                        state['wood'] += 1
                    elif event.key == pygame.K_s:
                        state['stone'] += 1
                    elif event.key == pygame.K_c and state['wood'] >= 10:
                        state['wood'] -= 10
                        state['weapon'] = {'name': 'Wooden Club', 'damage': 5}
                    elif event.key == pygame.K_f and state['weapon']:
                        start_fight()
                elif mode == MODE_FIGHT and event.key == pygame.K_SPACE:
                    fight_sequence()
        # Draw UI
        if mode == MODE_IDLE:
            draw_resources()
            draw_buttons()
        else:
            draw_bars()
        pygame.display.flip()
        clock.tick(30)
    pygame.quit()
    sys.exit()


if __name__ == "__main__":
    main()
