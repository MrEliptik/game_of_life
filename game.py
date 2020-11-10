import pygame
import random
import time
import numpy as np

WHITE = 255, 255, 255
BLACK = 0, 0, 0
size = width, height = 480, 320
row = 18
col = 32
cell_width = (width//col)
cell_height = (height//row)
font_size = 60

FPS = 30

LIVE_P_MAX = 0.5;
LIVE_P_MIN = 0.01;

_grid = np.full((row, col), None)

screen = None


def init_screen():
    pygame.init()
    screen = pygame.display.set_mode(size)
    screen.fill(BLACK)
    
    return screen

def refresh():
    pygame.display.update()

def display(grid):
    screen.fill(BLACK)
    for i in range(row):
        for j in range(col):
            if grid[i][j] == 1:
                # left, top, width, height
                pygame.draw.rect(screen, WHITE, (j*cell_width, i*cell_height, cell_width, cell_height), False)

    refresh()

def random_init_grid(grid):
    for i in range(row):
        for j in range(col):
            p = random.random() * (LIVE_P_MAX - LIVE_P_MIN) + LIVE_P_MIN
            if(random.random() < p): grid[i][j] = 1
            else: grid[i][j] = None

def get_cell(grid, cell):
    val = None
    try:
        val = grid[cell[0]][cell[1]]
    except:
        val = None

    return val

def get_neighbors(grid, cell):
    return (get_cell(grid, (cell[0], cell[1]-1)), get_cell(grid, (cell[0]-1, cell[1]-1)),
    get_cell(grid, (cell[0]-1, cell[1])), get_cell(grid, (cell[0-1], cell[1]+1)),
    get_cell(grid, (cell[0], cell[1]+1)), get_cell(grid, (cell[0]+1, cell[1]+1)),
    get_cell(grid, (cell[0]+1, cell[1])), get_cell(grid, (cell[0]+1, cell[1]-1)))

def get_living_neighbors(neighbors):
    living_count = 0
    for neighbor in neighbors:
        if neighbor == 1: living_count += 1

    return living_count

def update_grid(grid):
    new_grid = np.full((row, col), None)

    for i in range(row):
        for j in range(col):
            neighbors = get_neighbors(grid, (i,j))
            living = get_living_neighbors(neighbors)
            print(living)
        
            # Any dead cell with three live neighbors becoems a live cell
            if ((living == 2 or living == 3) and grid[i][j] == 1): new_grid[i][j] = 1

            # Any dead cell with three live neighbors becomes a live cell
            if (living == 3 and grid[i][j] == 0): new_grid[i][j] = 1

            # All others cells are dead (tmp is initialized at 0)
    print(new_grid)
    return new_grid

if __name__ == "__main__":
    running = True
    inpt = "y"
    screen = init_screen()
    random_init_grid(_grid)
    display(_grid)
    while(running):
        start = time.time()
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
        # Copy new grid
        _grid[:] = update_grid(_grid)
        #print(_grid)
        display(_grid)
        while(time.time() - start < (1/FPS)):
            pass
