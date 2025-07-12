// src/api/usePaginatedProjects.js
import { useState, useEffect } from 'react';
import axios from './axios';

export function usePaginatedProjects({ status, search, page = 1, pageSize = 10 }) {
  const [data, setData] = useState({ projects: [], total: 0, loading: true });

  useEffect(() => {
    setData(d => ({ ...d, loading: true }));
    axios.get('/projects', { params: { status, search, page, pageSize } })
      .then(res => setData({ projects: res.data.projects, total: res.data.total, loading: false }))
      .catch(() => setData({ projects: [], total: 0, loading: false }));
  }, [status, search, page, pageSize]);

  return data;
}
