async function getPaginatedProjects(Project, query, page = 1, pageSize = 10, sort = { createdAt: -1 }) {
  const skip = (parseInt(page) - 1) * parseInt(pageSize);
  console.log("➡️ Pagination Debug:");
  console.log("Page:", page, "PageSize:", pageSize, "Skip:", skip);
  const total = await Project.countDocuments(query);
  const projects = await Project.find(query).sort(sort).skip(skip).limit(parseInt(pageSize));
  return { projects, total };
}

module.exports = { getPaginatedProjects };







