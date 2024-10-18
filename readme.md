- [x]place players to the grid (random position for both players)
- stop game after google will take necessary points
- google must jump to empty cell (if player is in the cell - jump to other cell)
- [x]Create classes:
- - [x]Position (информационный эксперт\создатель  (GRASP))
- - [x]Google (информационный эксперт\создатель (GRASP))
- - [x]Settings (DI/инфраструктурный)
- - [x]GridSettings (DI)
- - [x]JumpSettings
- - [x]Player (like Google)
- - [x]Unit: Player extends Unit, Google extends Unit


// backward compatibility

// new Game(new Settings(new GridSettings()))


// entity objects vs value objects (DDD)
