'use strict';
const {
  Model, Op
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
     static async addTask(params) {
      return  await Todo.create(params);
    }
    static async showList() {
      console.log("My Todo list \n");

      console.log("Overdue");
      const overDueItems = await Todo.overdue();
      const overDueList = overDueItems.map((todo) => todo.displayableString()).join("\n");
      console.log(overDueList);
      console.log("\n");

      console.log("Due Today");
      const dueTodayItems = await Todo.dueToday();
      const dueTodayList = dueTodayItems.map((todo) => todo.displayableString()).join("\n");
      console.log(dueTodayList);
      console.log("\n");

      console.log("Due Later");
      const dueLaterItems = await Todo.dueLater();
      const dueLaterList = dueLaterItems.map((todo) => todo.displayableString()).join("\n");
      console.log(dueLaterList);
    }

    static async overdue() {
      return await Todo.findAll({
        where: {
          dueDate: { [Op.lt]: new Date() },
        },
        order: [["id", "ASC"]],
      });
    }

    static async dueToday() {
      return await Todo.findAll({
        where: { dueDate: new Date() },
        order: [["id", "ASC"]],
      });
    }

    static async dueLater() {
      return await Todo.findAll({
        where: { dueDate: { [Op.gt]: new Date() }},
        order: [["id", "ASC"]],
      });
    }

    static async markAsComplete(Id) {
      await Todo.update(
        {completed: true}, {
        where:{
          id: Id,
        },
      });
    }
    displayableString() {
      let checkbox = this.completed ? "[x]" : "[ ]";
      let displayDate = 
        this.dueDate === new Date().toLocaleDateString("en-CA")
          ? "" : this.dueDate;
      return `${this.id}. ${checkbox} ${this.title} ${displayDate}`.trim();
    }
  }
  Todo.init({
    title: DataTypes.STRING,
    dueDate: DataTypes.DATEONLY,
    completed: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Todo',
  });
  return Todo;
};