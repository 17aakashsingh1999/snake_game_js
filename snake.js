class Snake{
    constructor(rows, cols){
        this.rows = rows;
        this.cols = cols;
        this.time = 50;
        this.reset();
    }

    reset(){
        this.dir = 0;
        this._dir = 0;
        this.inputs = [];

        this.snake = [[Math.floor(this.rows/2) + 10, Math.floor(this.cols/2)], [Math.floor(this.rows/2), Math.floor(this.cols/2)]];

        this.table = null;
        this.food = null;
        this.score = 0;
        this.time = 50;
        this._runner = null;
        this._inputHandler = null;
        this._frame = false;
        document.getElementById('canvas').innerHTML = '';
    }

    foodOnBody(){
        for(var i=0;i<this.snake.length - 1;i++){
            var node1 = this.snake[i], node2 = this.snake[i+1];
            if(node1[0] == node2[0] && this.food[0] == node1[0]){
                if(node1[1] >= this.food[1] && this.food[1] >= node2[1]) return true;
                if(node2[1] >= this.food[1] && this.food[1] >= node1[1]) return true;
            }
            else if(node1[1] == node2[1] && this.food[1] == node1[1]){
                if(node1[0] >= this.food[0] && this.food[0] >= node2[0]) return true;
                if(node2[0] >= this.food[0] && this.food[0] >= node1[0]) return true;
            }
        }
        return false;
    }

    genFood(){
        do{
            this.food = [Math.floor(Math.random() * this.rows), Math.floor(Math.random() * this.cols)];
        }while(this.foodOnBody());
        this.table[this.food[0]][this.food[1]].style.backgroundColor = 'yellow';
    }

    collision(){
        var head = this.snake[this.snake.length - 1];
        if(head[0] < 0 || head[0] >= this.rows || head[1] < 0 || head[1] >= this.cols) return true;

        for(var i=0;i<this.snake.length - 1;i++){
            var node1 = this.snake[i], node2 = this.snake[i+1];

            if(node1[0] == node2[0] && head[0] == node1[0]){
                if(node1[1] >= head[1] && head[1] > node2[1]) return true;
                if(node2[1] > head[1] && head[1] >= node1[1]) return true;
            }
            else if(node1[1] == node2[1] && head[1] == node1[1]){
                if(node1[0] >= head[0] && head[0] > node2[0]) return true;
                if(node2[0] >  head[0] && head[0] >= node1[0]) return true;
            }
        }
        return false;
        
    }

    increaseSpeed(){
        if(this.time <= 0) return;
        clearInterval(this._runner);
        this.time -= 10;
        this._runner = setInterval(Snake.frame(this), this.time);
    }

    gameOver(){
        console.log('game over');
        window.removeEventListener('keydown', this._inputHandler);
        clearTimeout(this._runner);
        alert(`Game Over. Score: ${this.score}`);
        this.reset();
        this.setupBoard();
        this.startGame();
    }

    static frame(self){
        return function(){
            
            var obj = (self.dir == 0 || self.dir == 2 ? 1 : -1) + (self._dir == 0 || self._dir == 2 ? 1 : -1);
            if(obj != 2 && obj != -2){
                self.dir = self._dir;
                self.snake.push([...self.snake[self.snake.length - 1]]);
            }

            var head = self.snake[self.snake.length - 1];
            switch(self.dir){
                case 0:
                    head[0]--; break;
                case 1:
                    head[1]++; break;
                case 2:
                    head[0]++; break;
                case 3:
                    head[1]--; break;
            }
            if(self.collision()){
                self.gameOver();
                return;
            }
            self.table[head[0]][head[1]].style.backgroundColor = 'green';
            
            
            if(self.snake[self.snake.length - 1][0] == self.food[0] && self.snake[self.snake.length - 1][1] == self.food[1]){
                // console.log('food eaten');
                self.score += 1;
                self.genFood();
                // if(sefl.score % 5 == 0) self.increaseSpeed();
            }
            else{
                self.table[self.snake[0][0]][self.snake[0][1]].style.backgroundColor = 'red';
                self.snake[0][0] += self.snake[0][0] == self.snake[1][0] ? 0 : (self.snake[0][0] > self.snake[1][0] ? -1 : 1);
                self.snake[0][1] += self.snake[0][1] == self.snake[1][1] ? 0 : (self.snake[0][1] > self.snake[1][1] ? -1 : 1);
                if(self.snake[0][0] == self.snake[1][0] && self.snake[0][1] == self.snake[1][1]) self.snake.shift();
            }
            document.getElementById('score').innerHTML = String(self.score);
        }
    }

    drawSnake(){
        // console.log('drawing');
        for(var i=0;i<this.snake.length - 1;i++){
            var node1 = this.snake[i], node2 = this.snake[i+1];
            var del_x = node1[0] == node2[0] ? 0 : ( node1[0] > node2[0] ? -1 : 1);
            var del_y = node1[1] == node2[1] ? 0 : ( node1[1] > node2[1] ? -1 : 1);

            var x = node1[0], y = node1[1];
            do{
                this.table[x][y].style.backgroundColor = 'green';
                x += del_x;
                y += del_y;
            }while(x != node2[0] || y != node2[1]);
            this.table[x][y].style.backgroundColor = 'green'; 
        }
    }

    setupBoard(){
        // init table
        this.table = Array(this.rows);
        var table_ele = document.createElement('table');

        table_ele.style.border = 'solid black 2px';

        for(var i=0;i<this.rows;i++){
            this.table[i] = Array(this.cols);
            var row_ele = document.createElement('tr');
            for(var j=0;j<this.cols;j++){
                this.table[i][j] = document.createElement('td');
                this.table[i][j].style.height = '20px';
                this.table[i][j].style.width = '20px';
                this.table[i][j].style.backgroundColor = 'red';
                row_ele.appendChild(this.table[i][j]);
            }
            table_ele.appendChild(row_ele);
        }

        
        // insert the table to the html page
        document.getElementById('canvas').appendChild(table_ele);
        
        // now draw the snake on the board
        this.drawSnake();

        // generate and draw food
        this.genFood();
        
    }

    static inputHandler(self){
        return function(event){
            switch(event.key){
                case 'w':
                    self._dir = 0;
                    break;
                case 'd':
                    self._dir = 1;
                    break;
                case 's':
                    self._dir = 2;                    
                    break;
                case 'a':
                    self._dir = 3;
                    break;                     
            }
        }
    }

    startGame(){
        this._inputHandler = Snake.inputHandler(this);
        window.addEventListener('keydown', this._inputHandler);
        this._runner = setInterval(Snake.frame(this), this.time);
    }
}

var snake = new Snake(33, 73);
function main(){
    snake.setupBoard();
    snake.startGame();
}

main();