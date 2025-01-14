from app.models.tool import Tool
from app.db import db
import uuid

class ToolService:
    @staticmethod
    def create_tool(position, procedure, parameters, project_id):
        """
        Create a new tool for a project, shifting other tools as necessary.
        :param position: Position in the virtual tool list.
        :param procedure: Type of transformation (e.g., 'rotate').
        :param parameters: Parameters for the tool as a dictionary.
        :param project_id: UUID of the associated project.
        :return: Created tool as a dictionary.
        """
        # Shift tools at or after the specified position
        ToolService.shift_tools(position, project_id)

        # Create and save the new tool
        tool = Tool(
            id=str(uuid.uuid4()),
            position=position,
            procedure=procedure,
            parameters=parameters,
            project_id=project_id
        )
        tool.save()
        return tool.to_dict()

    @staticmethod
    def shift_tools(position, project_id):
        """
        Shift tools at or after the specified position to the next position.
        :param position: The position at which a new tool is being inserted.
        :param project_id: The project ID to filter tools by.
        """
        # Fetch all tools at or after the given position, ordered by position
        tools = Tool.query.filter(
            Tool.position >= position,
            Tool.project_id == project_id
        ).order_by(Tool.position.asc()).all()

        # Increment the position of each tool
        for tool in tools:
            tool.position += 1
            db.session.add(tool)

        # Commit the changes
        db.session.commit()

    @staticmethod
    def get_tools_by_project(project_id):
        """
        Get all tools for a specific project.
        :param project_id: The ID of the project.
        :return: A list of tools as dictionaries.
        """
        tools = Tool.query.filter_by(project_id=project_id).order_by(Tool.position.asc()).all()
        return [tool.to_dict() for tool in tools]
    

    def update_tool(tool_id, project_id, updates):
        """
        Update a tool's configuration, including position adjustments.
        :param tool_id: The ID of the tool to update.
        :param project_id: The ID of the project the tool belongs to.
        :param updates: A dictionary of updates to apply.
        :return: Updated tool as a dictionary.
        """
        # Fetch the existing tool
        tool = Tool.query.filter_by(id=tool_id, project_id=project_id).first()
        if not tool:
            raise Exception(f"Tool with ID '{tool_id}' not found in project '{project_id}'")

        # Handle position change
        new_position = updates.get("position")
        if new_position and new_position != tool.position:
            ToolService.adjust_positions(tool.position, new_position, project_id)

        # Apply other updates
        tool.procedure = updates.get("procedure", tool.procedure)
        tool.parameters = updates.get("parameters", tool.parameters)
        tool.position = new_position or tool.position

        # Save changes
        db.session.add(tool)
        db.session.commit()
        return tool.to_dict()

    @staticmethod
    def adjust_positions(old_position, new_position, project_id):
        """
        Adjust positions when a tool is moved.
        :param old_position: The current position of the tool.
        :param new_position: The new position of the tool.
        :param project_id: The ID of the project.
        """
        if old_position < new_position:
            # Shift tools between old_position and new_position up by 1
            tools = Tool.query.filter(
                Tool.position > old_position,
                Tool.position <= new_position,
                Tool.project_id == project_id
            ).order_by(Tool.position.asc()).all()

            for tool in tools:
                tool.position -= 1

        elif old_position > new_position:
            # Shift tools between new_position and old_position down by 1
            tools = Tool.query.filter(
                Tool.position >= new_position,
                Tool.position < old_position,
                Tool.project_id == project_id
            ).order_by(Tool.position.desc()).all()

            for tool in tools:
                tool.position += 1

        db.session.commit()

    @staticmethod
    def delete_tool(tool_id, project_id):
        """
        Delete a tool from a project and adjust positions of subsequent tools.
        :param tool_id: The ID of the tool to delete.
        :param project_id: The ID of the project the tool belongs to.
        """
        # Fetch the tool to determine its position
        tool = Tool.query.filter_by(id=tool_id, project_id=project_id).first()
        if not tool:
            raise Exception(f"Tool with ID '{tool_id}' not found in project '{project_id}'")

        position = tool.position

        # Delete the tool
        db.session.delete(tool)

        # Shift positions of subsequent tools
        tools = Tool.query.filter(
            Tool.position > position,
            Tool.project_id == project_id
        ).order_by(Tool.position.asc()).all()

        for t in tools:
            t.position -= 1
            db.session.add(t)

        # Commit changes
        db.session.commit()