import { z } from "zod";

export const task = z.object({
	id: z.number().int(),
	name: z.string().trim().min(1),
	slug: z.string().trim().min(1),
	description: z.string().trim().min(1),
	completed: z.boolean(),
	due_date: z.string().datetime(),
});

export const TaskModel = {
	tableName: "tasks",
	primaryKeys: ["id"],
	schema: task,
	serializer: (obj: Record<string, string | number | boolean>) => {
		const completedValue = obj.completed;
		const completed =
			typeof completedValue === "boolean"
				? completedValue
				: completedValue === 1 || completedValue === "1";

		return {
			...obj,
			completed,
		};
	},
	serializerObject: task,
};
